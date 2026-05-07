import type { IncomingMessage, ServerResponse } from "node:http";
import {
  callGroq,
  MAX_CONTEXT_CHARS,
  MAX_MESSAGE_CHARS,
  MAX_MESSAGES,
  MAX_TOTAL_MESSAGE_CHARS,
  normalizeMessages,
  readJsonPayload,
  resolveErrorMessage,
  resolveErrorStatus,
  sendJson,
  systemPrompt,
  truncate,
  validateContentType,
  type ChatContext,
} from "./_ai.js";

type ChatPayload = {
  messages?: unknown;
  context?: ChatContext;
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
    const payload = await readJsonPayload<ChatPayload>(req);
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
      [
        { role: "system", content: `${systemPrompt}${contextBlock}` },
        ...messages,
      ],
      { temperature: 0.3, maxTokens: 900 },
    );

    sendJson(res, 200, { message, model });
  } catch (error) {
    const statusCode = resolveErrorStatus(error);
    const message = resolveErrorMessage(error, "Unexpected AI request failure.");
    console.error(`[chat] ${message}`);
    sendJson(res, statusCode, { error: message });
  }
}
