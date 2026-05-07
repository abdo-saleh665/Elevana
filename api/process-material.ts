import type { IncomingMessage, ServerResponse } from "node:http";
import {
  callGroq,
  cleanupUpload,
  extractTextFromUpload,
  MAX_CONTEXT_CHARS,
  MAX_EXTRACTED_TEXT_CHARS,
  MAX_UPLOAD_SIZE,
  parseJsonObject,
  RequestError,
  resolveErrorMessage,
  resolveErrorStatus,
  sanitizeNotesPayload,
  sendJson,
  truncate,
  type NotesPayload,
} from "./_ai.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

type FormidableFields = Record<string, string[] | string>;
type FormidableFiles = Record<string, any>;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
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
      fields: FormidableFields;
      files: FormidableFiles;
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
      const notesPrompt = `Create rigorous university study notes as JSON only for this uploaded lecture.
Your job is to help a student actually study from the material, not just summarize it.

Return this exact JSON shape:
{
  "outline": [{"id":"overview","title":"Overview","subItems":["optional subtopics"]}],
  "summary": "120-180 word high-signal overview of the lecture",
  "keyTakeaways": ["5-8 specific, testable takeaways"],
  "body": [{"id":"overview","title":"Overview","content":"140-220 words of dense study notes"}],
  "professorNotes": ["2-4 exam-prep cautions, common traps, or study priorities"]
}

Quality rules:
- Create 5-8 body sections with stable kebab-case ids.
- Each body section must explain mechanisms, definitions, relationships, examples, and why it matters.
- Include likely exam angles, common confusions, and active-recall prompts inside the content when useful.
- Do not invent facts that are not supported by the source text; say what to verify if the source is unclear.
- Avoid generic advice like "study the main concepts" unless connected to a specific concept from the lecture.
- Return valid JSON only, without markdown fences.

Lecture title: ${title}
Source text:
${truncate(sourceText, MAX_CONTEXT_CHARS)}`;
      const { message, model } = await callGroq(
        [
          {
            role: "system",
            content: "You generate reliable university study notes. Return valid JSON only, without markdown.",
          },
          { role: "user", content: notesPrompt },
        ],
        { temperature: 0.18, maxTokens: 2800 },
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
      await cleanupUpload(filePath);
    }
  } catch (error) {
    const statusCode = resolveErrorStatus(error);
    const message = resolveErrorMessage(error, "Unable to process material.");
    console.error(`[process-material] ${message}`);
    sendJson(res, statusCode, { error: message });
  }
}
