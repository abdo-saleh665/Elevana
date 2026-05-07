import path from "node:path";
import { readFile, unlink } from "node:fs/promises";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatContext = {
  lectureTitle?: string;
  notesSummary?: string;
  sourceTextExcerpt?: string;
};

type NotesPayload = {
  outline: { id: string; title: string; subItems?: string[] }[];
  summary: string;
  keyTakeaways: string[];
  body: { id: string; title: string; content: string }[];
  professorNotes: string[];
};

type GeneratedQuizPayload = {
  title: string;
  description: string;
  questions: {
    id: string;
    topic: string;
    text: string;
    options: { id: string; text: string }[];
    correctOptionId: string;
    explanation: string;
  }[];
};

type GroqResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

const MAX_BODY_SIZE = 1_000_000;
const MAX_MESSAGES = 16;
const MAX_MESSAGE_CHARS = 4_000;
const MAX_TOTAL_MESSAGE_CHARS = 12_000;
const MAX_UPLOAD_SIZE = 20 * 1024 * 1024;
const MAX_EXTRACTED_TEXT_CHARS = 60_000;
const MAX_CONTEXT_CHARS = 14_000;
const GROQ_TIMEOUT_MS = 30_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const DEFAULT_GROQ_MODEL = "llama-3.1-8b-instant";

const systemPrompt = `You are Elevana AI, a concise study tutor for university students.
Explain concepts clearly, ask guiding questions when helpful, and generate study aids like summaries, quizzes, and study plans.
Use provided lecture context when it is present. If context is missing, say that you are answering from general study knowledge.`;

class RequestError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

const sendJson = (
  res: ServerResponse,
  statusCode: number,
  payload: Record<string, unknown>,
) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

const readRequestBody = (req: IncomingMessage) => {
  return new Promise<string>((resolve, reject) => {
    let body = "";
    let bytes = 0;
    let rejected = false;

    req.on("data", (chunk: Buffer) => {
      bytes += chunk.length;
      body += chunk.toString("utf8");

      if (bytes > MAX_BODY_SIZE && !rejected) {
        rejected = true;
        reject(new RequestError(413, "Request body is too large."));
        req.destroy();
      }
    });

    req.on("end", () => {
      if (!rejected) {
        resolve(body);
      }
    });

    req.on("error", reject);
  });
};

const validateContentType = (req: IncomingMessage) => {
  const contentType = req.headers["content-type"];

  return typeof contentType === "string" && contentType.includes("application/json");
};

const truncate = (value: string, maxLength: number) =>
  value.length > maxLength ? `${value.slice(0, maxLength)}\n\n[truncated]` : value;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "section";

const parseJsonObject = <T,>(content: string): T | null => {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const candidate = fenced || trimmed.match(/\{[\s\S]*\}/)?.[0] || trimmed;

  try {
    return JSON.parse(candidate) as T;
  } catch {
    return null;
  }
};

const callGroq = async (
  env: Record<string, string>,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  options: { temperature?: number; maxTokens?: number } = {},
) => {
  const apiKey = env.GROQ_API_KEY || process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new RequestError(
      500,
      "Missing GROQ_API_KEY. Add it to .env.local and restart npm run dev.",
    );
  }

  const model = env.GROQ_MODEL || DEFAULT_GROQ_MODEL;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS);

  try {
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: options.temperature ?? 0.25,
          max_tokens: options.maxTokens ?? 1200,
        }),
        signal: controller.signal,
      },
    );
    const groqJson = (await groqResponse
      .json()
      .catch(() => null)) as GroqResponse | null;

    if (!groqResponse.ok) {
      let errorMessage = groqJson?.error?.message || "The AI provider request failed.";
      if (groqResponse.status === 429) {
        errorMessage = "The AI is currently processing too many requests. Please wait a moment and try again.";
      }
      throw new RequestError(groqResponse.status, errorMessage);
    }

    const message = groqJson?.choices?.[0]?.message?.content?.trim();

    if (!message) {
      throw new RequestError(502, "Groq returned an empty response.");
    }

    return { message, model };
  } finally {
    clearTimeout(timeout);
  }
};

const createFallbackNotes = (title: string, sourceText: string): NotesPayload => {
  const cleanText = sourceText.replace(/\s+/g, " ").trim();
  const sentences = cleanText
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const summary = sentences.slice(0, 3).join(" ") || `Review ${title} and identify the most important terms, examples, and exam-style questions.`;
  const takeaways = sentences.slice(3, 7);

  return {
    outline: [
      { id: "overview", title: "Overview" },
      { id: "key-concepts", title: "Key Concepts", subItems: ["Definitions", "Examples"] },
      { id: "review-plan", title: "Review Plan" },
    ],
    summary,
    keyTakeaways: takeaways.length
      ? takeaways
      : [
          "Review the main definitions and connect them to examples from class.",
          "Convert each heading into one active-recall question.",
          "Revisit confusing sections before starting the quiz.",
        ],
    body: [
      {
        id: "overview",
        title: "Overview",
        content: summary,
      },
      {
        id: "key-concepts",
        title: "Key Concepts",
        content: sentences.slice(7, 13).join(" ") || cleanText.slice(0, 900) || "The uploaded material was parsed, but only limited text was available.",
      },
      {
        id: "review-plan",
        title: "Review Plan",
        content: "Read the summary, explain each takeaway without looking, then use the generated quiz to identify weak areas.",
      },
    ],
    professorNotes: [
      "This is an MVP-generated study note. Verify key facts against your original lecture material.",
    ],
  };
};

const createFallbackQuiz = (title: string, notes: NotesPayload): GeneratedQuizPayload => {
  const topics = [title, ...notes.keyTakeaways].slice(0, 5);

  return {
    title: `${title} Quiz`,
    description: `Generated from ${title} notes.`,
    questions: topics.map((topic, index) => ({
      id: `q${index + 1}`,
      topic: index === 0 ? title : "Key Takeaway",
      text: `Which study action best checks your understanding of: ${topic}?`,
      options: [
        { id: "opt1", text: "Reread it once without testing yourself" },
        { id: "opt2", text: "Explain it from memory and check mistakes" },
        { id: "opt3", text: "Skip it unless it appears on an exam" },
        { id: "opt4", text: "Highlight the sentence only" },
      ],
      correctOptionId: "opt2",
      explanation: "Active recall followed by mistake review is the strongest way to verify understanding.",
    })),
  };
};

const sanitizeNotesPayload = (payload: Partial<NotesPayload> | null, title: string, sourceText: string): NotesPayload => {
  const fallback = createFallbackNotes(title, sourceText);

  return {
    outline: Array.isArray(payload?.outline) && payload.outline.length ? payload.outline : fallback.outline,
    summary: typeof payload?.summary === "string" && payload.summary.trim() ? payload.summary.trim() : fallback.summary,
    keyTakeaways: Array.isArray(payload?.keyTakeaways) && payload.keyTakeaways.length
      ? payload.keyTakeaways.filter((item): item is string => typeof item === "string").slice(0, 6)
      : fallback.keyTakeaways,
    body: Array.isArray(payload?.body) && payload.body.length
      ? payload.body
          .filter((section) => section && typeof section.title === "string" && typeof section.content === "string")
          .slice(0, 6)
          .map((section, index) => ({
            id: typeof section.id === "string" && section.id ? section.id : slugify(section.title || `section-${index + 1}`),
            title: section.title,
            content: section.content,
          }))
      : fallback.body,
    professorNotes: Array.isArray(payload?.professorNotes) && payload.professorNotes.length
      ? payload.professorNotes.filter((item): item is string => typeof item === "string").slice(0, 3)
      : fallback.professorNotes,
  };
};

const sanitizeQuizPayload = (
  payload: Partial<GeneratedQuizPayload> | null,
  title: string,
  notes: NotesPayload,
): GeneratedQuizPayload => {
  const fallback = createFallbackQuiz(title, notes);
  const questions = Array.isArray(payload?.questions)
    ? payload.questions
        .filter((question) =>
          question &&
          typeof question.text === "string" &&
          Array.isArray(question.options) &&
          question.options.length >= 2,
        )
        .slice(0, 8)
        .map((question, index) => {
          const options = question.options
            .filter((option) => option && typeof option.text === "string")
            .slice(0, 4)
            .map((option, optionIndex) => ({
              id: option.id || `opt${optionIndex + 1}`,
              text: option.text,
            }));
          const correctOptionId = options.some((option) => option.id === question.correctOptionId)
            ? question.correctOptionId
            : options[0]?.id || "opt1";

          return {
            id: question.id || `q${index + 1}`,
            topic: question.topic || title,
            text: question.text,
            options,
            correctOptionId,
            explanation: question.explanation || "Review the related notes section to understand this answer.",
          };
        })
    : [];

  return {
    title: typeof payload?.title === "string" && payload.title.trim() ? payload.title.trim() : fallback.title,
    description: typeof payload?.description === "string" && payload.description.trim() ? payload.description.trim() : fallback.description,
    questions: questions.length ? questions : fallback.questions,
  };
};

const extractTextFromUpload = async (filePath: string, fileName: string, mimeType?: string) => {
  const buffer = await readFile(filePath);
  const lowerName = fileName.toLowerCase();

  if (mimeType === "application/pdf" || lowerName.endsWith(".pdf")) {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return result.text;
    } finally {
      await parser.destroy();
    }
  }

  if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    lowerName.endsWith(".docx")
  ) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (mimeType?.startsWith("text/") || lowerName.endsWith(".txt") || lowerName.endsWith(".md")) {
    return buffer.toString("utf8");
  }

  throw new RequestError(415, "Upload a PDF, DOCX, TXT, or Markdown file for this MVP.");
};

const normalizeMessages = (value: unknown): ChatMessage[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((message): ChatMessage[] => {
    if (
      !message ||
      typeof message !== "object" ||
      !("role" in message) ||
      !("content" in message)
    ) {
      return [];
    }

    const role = message.role;
    const content = message.content;

    if (
      (role !== "user" && role !== "assistant") ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      return [];
    }

    return [{ role, content: content.trim() }];
  });
};

const groqChatPlugin = (env: Record<string, string>): Plugin => ({
  name: "local-groq-chat-api",
  configureServer(server) {
    const rateLimit = new Map<string, { count: number; resetAt: number }>();

    server.middlewares.use("/api/chat", async (req, res) => {
      if (req.method !== "POST") {
        sendJson(res, 405, { error: "Only POST requests are supported." });
        return;
      }

      if (!validateContentType(req)) {
        sendJson(res, 415, { error: "Content-Type must be application/json." });
        return;
      }

      const clientId = req.socket.remoteAddress || "local";
      const now = Date.now();
      const currentLimit = rateLimit.get(clientId);

      if (!currentLimit || currentLimit.resetAt <= now) {
        rateLimit.set(clientId, {
          count: 1,
          resetAt: now + RATE_LIMIT_WINDOW_MS,
        });
      } else if (currentLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
        sendJson(res, 429, { error: "Too many AI requests. Please wait a minute." });
        return;
      } else {
        currentLimit.count += 1;
      }

      const apiKey = env.GROQ_API_KEY || process.env.GROQ_API_KEY;

      if (!apiKey) {
        sendJson(res, 500, {
          error: "Missing GROQ_API_KEY. Please get an API key from https://console.groq.com, add it to .env.local, and restart npm run dev.",
        });
        return;
      }

      try {
        const bodyText = await readRequestBody(req);
        const payload = JSON.parse(bodyText || "{}") as { messages?: unknown; context?: ChatContext };
        const messages = normalizeMessages(payload.messages).slice(-MAX_MESSAGES);
        const context = payload.context;

        if (!messages.some((message) => message.role === "user")) {
          sendJson(res, 400, { error: "Send at least one user message." });
          return;
        }

        const totalMessageChars = messages.reduce(
          (total, message) => total + message.content.length,
          0,
        );

        if (messages.some((message) => message.content.length > MAX_MESSAGE_CHARS)) {
          sendJson(res, 400, {
            error: `Each message must be ${MAX_MESSAGE_CHARS} characters or fewer.`,
          });
          return;
        }

        if (totalMessageChars > MAX_TOTAL_MESSAGE_CHARS) {
          sendJson(res, 400, {
            error: `Conversation context must be ${MAX_TOTAL_MESSAGE_CHARS} characters or fewer.`,
          });
          return;
        }

        const contextBlock = context
          ? `\n\nLecture context:\nTitle: ${context.lectureTitle || "Untitled"}\nSummary: ${context.notesSummary || "No notes summary"}\nSource excerpt:\n${truncate(context.sourceTextExcerpt || "", MAX_CONTEXT_CHARS)}`
          : "";
        const { message, model } = await callGroq(
          env,
          [
            { role: "system", content: `${systemPrompt}${contextBlock}` },
            ...messages,
          ],
          { temperature: 0.3, maxTokens: 900 },
        );

        sendJson(res, 200, { message, model });
      } catch (error) {
        const message =
          error instanceof SyntaxError
            ? "Invalid JSON request body."
            : error instanceof Error
              ? error.message
              : "Unexpected AI request failure.";
        const statusCode =
          error instanceof RequestError
            ? error.statusCode
            : error instanceof SyntaxError
              ? 400
              : error instanceof Error && error.name === "AbortError"
                ? 504
                : 500;

        server.config.logger.error(`[groq-api] ${message}`);
        sendJson(res, statusCode, {
          error:
            statusCode === 504
              ? "The AI provider timed out. Please try again."
              : message,
        });
      }
    });

    server.middlewares.use("/api/process-material", async (req, res) => {
      if (req.method !== "POST") {
        sendJson(res, 405, { error: "Only POST requests are supported." });
        return;
      }

      try {
        const formidableModule = await import("formidable");
        const form = formidableModule.default({
          maxFileSize: MAX_UPLOAD_SIZE,
          multiples: false,
          keepExtensions: true,
        });
        const { fields, files } = await new Promise<{
          fields: Record<string, string[] | string>;
          files: Record<string, any>;
        }>((resolve, reject) => {
          form.parse(req, (error, parsedFields, parsedFiles) => {
            if (error) {
              reject(error);
              return;
            }
            resolve({ fields: parsedFields, files: parsedFiles });
          });
        });
        const uploaded = Array.isArray(files.file) ? files.file[0] : files.file;

        if (!uploaded) {
          sendJson(res, 400, { error: "Attach a file named file." });
          return;
        }

        const filePath = uploaded.filepath as string;
        const originalName = (uploaded.originalFilename as string | null) || "Uploaded material";
        const mimeType = uploaded.mimetype as string | undefined;

        try {
          const rawText = await extractTextFromUpload(filePath, originalName, mimeType);
          const sourceText = truncate(rawText.replace(/\u0000/g, " ").replace(/[ \t]+/g, " ").trim(), MAX_EXTRACTED_TEXT_CHARS);

          if (sourceText.length < 80) {
            throw new RequestError(422, "Could not extract enough readable text from that file.");
          }

          const title = String(Array.isArray(fields.title) ? fields.title[0] : fields.title || originalName)
            .replace(/\.[^/.]+$/, "")
            .trim();
          const notesPrompt = `Create structured study notes as JSON only for this uploaded lecture.
Return this exact shape:
{
  "outline": [{"id":"overview","title":"Overview","subItems":["optional"]}],
  "summary": "short paragraph",
  "keyTakeaways": ["3-6 concise takeaways"],
  "body": [{"id":"overview","title":"Overview","content":"useful study notes"}],
  "professorNotes": ["1-2 caution or exam-prep notes"]
}
Lecture title: ${title}
Source text:
${truncate(sourceText, MAX_CONTEXT_CHARS)}`;
          const { message, model } = await callGroq(
            env,
            [
              {
                role: "system",
                content: "You generate reliable university study notes. Return valid JSON only, without markdown.",
              },
              { role: "user", content: notesPrompt },
            ],
            { temperature: 0.2, maxTokens: 1400 },
          );
          const notes = sanitizeNotesPayload(parseJsonObject<NotesPayload>(message), title, sourceText);

          sendJson(res, 200, {
            model,
            sourceText,
            lecturePatch: {
              title,
              description: notes.summary,
              readTime: `${Math.max(4, Math.ceil(sourceText.split(/\s+/).length / 180))} min read`,
              accuracyLabel: "AI notes generated",
              status: "ready",
              progress: 100,
            },
            notes,
          });
        } finally {
          await unlink(filePath).catch(() => undefined);
        }
      } catch (error) {
        const statusCode = error instanceof RequestError ? error.statusCode : 500;
        const message = error instanceof Error ? error.message : "Unable to process material.";
        server.config.logger.error(`[process-material] ${message}`);
        sendJson(res, statusCode, { error: message });
      }
    });

    server.middlewares.use("/api/generate-quiz", async (req, res) => {
      if (req.method !== "POST") {
        sendJson(res, 405, { error: "Only POST requests are supported." });
        return;
      }

      if (!validateContentType(req)) {
        sendJson(res, 415, { error: "Content-Type must be application/json." });
        return;
      }

      try {
        const bodyText = await readRequestBody(req);
        const payload = JSON.parse(bodyText || "{}") as {
          lectureTitle?: string;
          notes?: NotesPayload;
          sourceText?: string;
        };
        const title = payload.lectureTitle || "Lecture";
        const notes = sanitizeNotesPayload(payload.notes || null, title, payload.sourceText || "");
        const quizPrompt = `Create a multiple-choice quiz as JSON only from these lecture notes.
Return this exact shape:
{
  "title": "Quiz title",
  "description": "one sentence",
  "questions": [
    {
      "id": "q1",
      "topic": "topic",
      "text": "question",
      "options": [{"id":"opt1","text":"answer"}],
      "correctOptionId": "opt1",
      "explanation": "why the answer is correct"
    }
  ]
}
Create 5 questions. Use exactly 4 options per question.
Lecture title: ${title}
Notes:
${truncate(JSON.stringify(notes), MAX_CONTEXT_CHARS)}`;
        const { message, model } = await callGroq(
          env,
          [
            {
              role: "system",
              content: "You write rigorous university practice quizzes. Return valid JSON only, without markdown.",
            },
            { role: "user", content: quizPrompt },
          ],
          { temperature: 0.25, maxTokens: 1300 },
        );
        const quiz = sanitizeQuizPayload(parseJsonObject<GeneratedQuizPayload>(message), title, notes);

        sendJson(res, 200, { model, quiz });
      } catch (error) {
        const statusCode =
          error instanceof RequestError
            ? error.statusCode
            : error instanceof SyntaxError
              ? 400
              : error instanceof Error && error.name === "AbortError"
                ? 504
                : 500;
        const message = error instanceof Error ? error.message : "Unable to generate quiz.";
        server.config.logger.error(`[generate-quiz] ${message}`);
        sendJson(res, statusCode, { error: message });
      }
    });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "GROQ_");

  return {
    server: {
      port: 3000,
      host: "127.0.0.1",
    },
    plugins: [react(), groqChatPlugin(env)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
