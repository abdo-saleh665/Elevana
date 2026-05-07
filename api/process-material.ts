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
} from "./_ai";

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
      await cleanupUpload(filePath);
    }
  } catch (error) {
    const statusCode = resolveErrorStatus(error);
    const message = resolveErrorMessage(error, "Unable to process material.");
    console.error(`[process-material] ${message}`);
    sendJson(res, statusCode, { error: message });
  }
}
