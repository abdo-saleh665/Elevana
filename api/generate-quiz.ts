import type { IncomingMessage, ServerResponse } from "node:http";
import {
  callGroq,
  MAX_CONTEXT_CHARS,
  parseJsonObject,
  readJsonPayload,
  resolveErrorMessage,
  resolveErrorStatus,
  sanitizeNotesPayload,
  sanitizeQuizPayload,
  sendJson,
  truncate,
  validateContentType,
  type GeneratedQuizPayload,
  type NotesPayload,
} from "./_ai";

type GenerateQuizPayload = {
  lectureTitle?: string;
  notes?: NotesPayload;
  sourceText?: string;
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Only POST requests are supported." });
    return;
  }

  if (!validateContentType(req)) {
    sendJson(res, 415, { error: "Content-Type must be application/json." });
    return;
  }

  try {
    const payload = await readJsonPayload<GenerateQuizPayload>(req);
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
    const statusCode = resolveErrorStatus(error);
    const message = resolveErrorMessage(error, "Unable to generate quiz.");
    console.error(`[generate-quiz] ${message}`);
    sendJson(res, statusCode, { error: message });
  }
}
