import { readFile, unlink } from "node:fs/promises";
import type { IncomingMessage, ServerResponse } from "node:http";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ChatContext = {
  lectureTitle?: string;
  notesSummary?: string;
  sourceTextExcerpt?: string;
};

export type NotesPayload = {
  outline: { id: string; title: string; subItems?: string[] }[];
  summary: string;
  keyTakeaways: string[];
  body: { id: string; title: string; content: string }[];
  professorNotes: string[];
};

export type GeneratedQuizPayload = {
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

type RequestWithBody = IncomingMessage & {
  body?: unknown;
  query?: Record<string, string | string[]>;
};

export const MAX_BODY_SIZE = 1_000_000;
export const MAX_MESSAGES = 16;
export const MAX_MESSAGE_CHARS = 4_000;
export const MAX_TOTAL_MESSAGE_CHARS = 12_000;
export const MAX_UPLOAD_SIZE = 20 * 1024 * 1024;
export const MAX_EXTRACTED_TEXT_CHARS = 60_000;
export const MAX_CONTEXT_CHARS = 24_000;

const GROQ_TIMEOUT_MS = 30_000;
const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";

export const systemPrompt = `You are Elevana AI, a concise study tutor for university students.
Explain concepts clearly, ask guiding questions when helpful, and generate study aids like summaries, quizzes, and study plans.
Use provided lecture context when it is present. If context is missing, say that you are answering from general study knowledge.`;

export class RequestError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

export const sendJson = (
  res: ServerResponse,
  statusCode: number,
  payload: Record<string, unknown>,
) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

export const readRequestBody = (req: IncomingMessage) => {
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

export const readJsonPayload = async <T>(req: RequestWithBody): Promise<T> => {
  if (req.body && typeof req.body === "object") {
    return req.body as T;
  }

  if (typeof req.body === "string") {
    return JSON.parse(req.body || "{}") as T;
  }

  const bodyText = await readRequestBody(req);
  return JSON.parse(bodyText || "{}") as T;
};

export const validateContentType = (req: IncomingMessage) => {
  const contentType = req.headers["content-type"];

  return typeof contentType === "string" && contentType.includes("application/json");
};

export const truncate = (value: string, maxLength: number) =>
  value.length > maxLength ? `${value.slice(0, maxLength)}\n\n[truncated]` : value;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "section";

export const parseJsonObject = <T,>(content: string): T | null => {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const candidate = fenced || trimmed.match(/\{[\s\S]*\}/)?.[0] || trimmed;

  try {
    return JSON.parse(candidate) as T;
  } catch {
    return null;
  }
};

export const callGroq = async (
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  options: { temperature?: number; maxTokens?: number } = {},
) => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new RequestError(
      500,
      "Missing GROQ_API_KEY. Add it in your Vercel project environment variables.",
    );
  }

  const model = process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL;
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
  const summary = sentences.slice(0, 5).join(" ") || `Review ${title} and identify the most important terms, examples, and exam-style questions.`;
  const takeaways = sentences.slice(5, 11);
  const fallbackSections = [
    {
      id: "overview",
      title: "Overview",
      content: summary,
    },
    {
      id: "core-concepts",
      title: "Core Concepts",
      content: sentences.slice(11, 18).join(" ") || cleanText.slice(0, 1200) || "Identify the central vocabulary, mechanisms, and relationships introduced in this material.",
    },
    {
      id: "examples-and-applications",
      title: "Examples and Applications",
      content: sentences.slice(18, 25).join(" ") || "Connect each concept to a concrete lecture example, diagram, case, calculation, or real-world application.",
    },
    {
      id: "exam-focus",
      title: "Exam Focus",
      content: "Prioritize definitions, cause-and-effect relationships, compare-and-contrast questions, and steps in any process. Turn each subsection into an active-recall question before reviewing the answer.",
    },
    {
      id: "common-mistakes",
      title: "Common Mistakes",
      content: "Watch for terms that sound similar, steps that must happen in order, and examples that test exceptions rather than the general rule.",
    },
  ];

  return {
    outline: [
      { id: "overview", title: "Overview" },
      { id: "core-concepts", title: "Core Concepts", subItems: ["Definitions", "Relationships"] },
      { id: "examples-and-applications", title: "Examples and Applications" },
      { id: "exam-focus", title: "Exam Focus" },
      { id: "common-mistakes", title: "Common Mistakes" },
    ],
    summary,
    keyTakeaways: takeaways.length
      ? takeaways
      : [
          "Review the main definitions and connect them to examples from class.",
          "Convert each heading into one active-recall question.",
          "Revisit confusing sections before starting the quiz.",
        ],
    body: fallbackSections,
    professorNotes: [
      "Verify high-stakes facts, formulas, names, and dates against the original lecture material before an exam.",
      "If a section feels easy, test it by explaining it from memory and writing one exam-style question for it.",
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

export const sanitizeNotesPayload = (payload: Partial<NotesPayload> | null, title: string, sourceText: string): NotesPayload => {
  const fallback = createFallbackNotes(title, sourceText);

  return {
    outline: Array.isArray(payload?.outline) && payload.outline.length ? payload.outline : fallback.outline,
    summary: typeof payload?.summary === "string" && payload.summary.trim() ? payload.summary.trim() : fallback.summary,
    keyTakeaways: Array.isArray(payload?.keyTakeaways) && payload.keyTakeaways.length
      ? payload.keyTakeaways.filter((item): item is string => typeof item === "string").slice(0, 8)
      : fallback.keyTakeaways,
    body: Array.isArray(payload?.body) && payload.body.length
      ? payload.body
          .filter((section) => section && typeof section.title === "string" && typeof section.content === "string")
          .slice(0, 8)
          .map((section, index) => ({
            id: typeof section.id === "string" && section.id ? section.id : slugify(section.title || `section-${index + 1}`),
            title: section.title,
            content: section.content,
          }))
      : fallback.body,
    professorNotes: Array.isArray(payload?.professorNotes) && payload.professorNotes.length
      ? payload.professorNotes.filter((item): item is string => typeof item === "string").slice(0, 4)
      : fallback.professorNotes,
  };
};

export const sanitizeQuizPayload = (
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

export const extractTextFromUpload = async (filePath: string, fileName: string, mimeType?: string) => {
  const buffer = await readFile(filePath);
  const lowerName = fileName.toLowerCase();

  if (mimeType === "application/pdf" || lowerName.endsWith(".pdf")) {
    const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default as (
      data: Buffer,
    ) => Promise<{ text?: string }>;
    const result = await pdfParse(buffer);
    return result.text || "";
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

export const cleanupUpload = async (filePath: string) => {
  await unlink(filePath).catch(() => undefined);
};

export const normalizeMessages = (value: unknown): ChatMessage[] => {
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

export const resolveErrorStatus = (error: unknown) => {
  if (error instanceof RequestError) return error.statusCode;
  if (error instanceof SyntaxError) return 400;
  if (error instanceof Error && error.name === "AbortError") return 504;
  return 500;
};

export const resolveErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof SyntaxError) return "Invalid JSON request body.";
  if (error instanceof Error && error.name === "AbortError") return "The AI provider timed out. Please try again.";
  if (error instanceof Error) return error.message;
  return fallback;
};
