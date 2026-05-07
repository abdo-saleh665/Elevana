import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  createId,
  updateAppState,
  useAppState,
  type AiChatMessage,
} from "../localStore";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type SuggestedAction = {
  icon: string;
  label: string;
  prompt: string;
};

type ChatResponse = {
  message?: string;
  error?: string;
};

const suggestedActions: SuggestedAction[] = [
  {
    icon: "summarize",
    label: "Summarize",
    prompt: "Summarize this topic into clear study notes with key definitions.",
  },
  {
    icon: "quiz",
    label: "Generate Quiz",
    prompt: "Create a 5-question quiz for this topic and include the answers.",
  },
  {
    icon: "school",
    label: "Create Study Guide",
    prompt: "Create a focused study guide with important concepts and common mistakes.",
  },
  {
    icon: "check_circle",
    label: "Check Understanding",
    prompt:
      "Ask me 3 short questions to check whether I understand this topic.",
  },
];

const relatedTopics = [
  "Cell Cycle Regulation",
  "Genetic Variation",
  "DNA Replication",
];

const AITutor: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appState = useAppState();
  const scopedLectureId = searchParams.get("lectureId") || undefined;
  const scopedLecture = appState.lectures.find((lecture) => lecture.id === scopedLectureId);
  const scopedNotes = scopedLectureId ? appState.lectureNotes[scopedLectureId] : undefined;
  const hasSourceContext = Boolean(scopedLecture && scopedNotes && (scopedLecture.sourceText || scopedNotes.summary));
  const [threadId, setThreadId] = useState(() =>
    appState.aiChats.find((thread) => thread.lectureId === scopedLectureId)?.id ||
    appState.aiChats[0]?.id ||
    createId("chat"),
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const existingThread = appState.aiChats.find((thread) => thread.id === threadId);

    if (existingThread) {
      setMessages(existingThread.messages.map(({ role, content }) => ({ role, content })));
      return;
    }

    const createdAt = new Date().toISOString();
    updateAppState((state) => ({
      ...state,
      aiChats: [
        {
          id: threadId,
          title: scopedLecture ? `${scopedLecture.title} Chat` : "New AI Tutor Chat",
          lectureId: scopedLecture?.id,
          messages: [],
          createdAt,
          updatedAt: createdAt,
        },
        ...state.aiChats,
      ],
    }));
  }, [threadId]);

  useEffect(() => {
    if (!scopedLectureId) return;
    const existingThread = appState.aiChats.find((thread) => thread.lectureId === scopedLectureId);
    setThreadId(existingThread?.id || createId("chat"));
  }, [scopedLectureId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading, error]);

  const handleSuggestedAction = (prompt: string) => {
    setInput(prompt);
    setError(null);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const persistMessages = (newMessages: AiChatMessage[]) => {
    updateAppState((state) => ({
      ...state,
      aiChats: state.aiChats.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              title: newMessages[0]?.content.slice(0, 42) || thread.title,
              messages: [...thread.messages, ...newMessages],
              updatedAt: new Date().toISOString(),
            }
          : thread,
      ),
    }));
  };

  const handleShareChat = async () => {
    const transcript = messages
      .map((message) => `${message.role === "user" ? "You" : "Elevana AI"}: ${message.content}`)
      .join("\n\n");
    await navigator.clipboard.writeText(transcript || "Empty Elevana AI chat");
    setError("Chat transcript copied locally.");
  };

  const handleVoiceInput = () => {
    setError("Voice input is not connected yet. Type your prompt or paste lecture text for now.");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const content = input.trim();

    if (!content || isLoading) {
      return;
    }

    const userMessage: ChatMessage = { role: "user", content };
    const persistedUserMessage: AiChatMessage = {
      id: createId("message"),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    persistMessages([persistedUserMessage]);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages,
          context: hasSourceContext
            ? {
                lectureTitle: scopedLecture?.title,
                notesSummary: scopedNotes?.summary,
                sourceTextExcerpt:
                  scopedLecture?.sourceText ||
                  scopedNotes?.body.map((section) => `${section.title}: ${section.content}`).join("\n\n"),
              }
            : undefined,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as ChatResponse;

      if (!response.ok) {
        throw new Error(data.error || "The AI tutor request failed.");
      }

      const assistantMessage = data.message?.trim();

      if (!assistantMessage) {
        throw new Error("The AI tutor returned an empty response.");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        { role: "assistant", content: assistantMessage },
      ]);
      persistMessages([
        {
          id: createId("message"),
          role: "assistant",
          content: assistantMessage,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to reach the AI tutor.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-background-light dark:bg-background-dark">
      <div className="flex-1 flex flex-col h-full relative overflow-x-hidden min-w-0">
        <header className="h-14 px-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-white/50 dark:bg-background-dark/50 backdrop-blur-sm z-10 sticky top-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                Current Scope
              </span>
              <button onClick={() => navigate("/lectures")} className="flex items-center gap-1.5 cursor-pointer group min-w-0 text-left">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors truncate">
                  {scopedLecture ? scopedLecture.title : "General Study Chat"}
                </span>
                <span className="material-symbols-outlined text-base text-slate-400 group-hover:text-primary transition-colors">
                  expand_more
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setError("Tutor preferences are stored with your local Settings page.")}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              aria-label="AI tutor settings"
            >
              <span className="material-symbols-outlined text-[20px]">
                settings
              </span>
            </button>
            <button
              type="button"
              onClick={handleShareChat}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              aria-label="Share chat"
            >
              <span className="material-symbols-outlined text-[20px]">
                ios_share
              </span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-5 space-y-6">
          <div className="flex justify-center">
            <span className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-0.5 rounded-full">
              TODAY
            </span>
          </div>

          {messages.map((message, index) =>
            message.role === "user" ? (
              <div className="flex justify-end" key={`${message.role}-${index}`}>
                <div className="max-w-xl bg-[#312E81] text-white rounded-2xl rounded-tr-sm p-3.5 shadow-sm relative group">
                  <p className="leading-relaxed text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <div className="absolute -right-10 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                    <div className="w-7 h-7 rounded-full bg-[#FAFAFA] border border-slate-200 flex items-center justify-center">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                        alt="User"
                        className="w-5 h-5 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-start" key={`${message.role}-${index}`}>
                <div className="flex items-end gap-3 max-w-3xl">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mb-4 shadow-md shadow-indigo-600/20 text-white">
                    <span className="material-symbols-outlined text-base">
                      smart_toy
                    </span>
                  </div>
                  <div className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-2xl rounded-tl-sm p-5 shadow-sm">
                    <div className="prose prose-sm prose-slate dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            ),
          )}

          {isLoading && (
            <div className="flex justify-start" aria-live="polite">
              <div className="flex items-end gap-3 max-w-3xl">
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mb-4 shadow-md shadow-indigo-600/20 text-white">
                  <span className="material-symbols-outlined text-base">
                    smart_toy
                  </span>
                </div>
                <div className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  Elevana AI is thinking...
                </div>
              </div>
            </div>
          )}

          {error && (
            <div
              className="max-w-4xl mx-auto flex items-start gap-2 rounded-xl border border-red-100 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 px-3 py-2 text-xs text-red-700 dark:text-red-300"
              role="alert"
            >
              <span className="material-symbols-outlined text-[16px] mt-0.5">
                error
              </span>
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 pt-2 bg-gradient-to-t from-white via-white to-transparent dark:from-background-dark dark:via-background-dark pb-6">
          <form className="max-w-4xl mx-auto space-y-3" onSubmit={handleSubmit}>
            <style>{`
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {suggestedActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => handleSuggestedAction(action.prompt)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/30 shadow-sm hover:shadow-md hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {action.icon}
                  </span>
                  {action.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <button
                  type="button"
                  onClick={() => navigate("/lectures")}
                  className="p-1.5 text-primary bg-indigo-50 dark:bg-indigo-900/20 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                  aria-label="Add study material"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    add
                  </span>
                </button>
              </div>
              <input
                ref={inputRef}
                type="text"
                aria-label="Ask the AI tutor"
                name="aiTutorPrompt"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="w-full pl-10 pr-20 py-3 text-sm bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 dark:text-white placeholder:text-slate-400 disabled:opacity-70 text-ellipsis"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label="Voice input"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    mic
                  </span>
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-1.5 bg-primary text-white rounded-lg shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
                  aria-label="Send message"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    send
                  </span>
                </button>
              </div>
            </div>

            <div className="flex justify-center items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 select-none text-center">
              <span className="material-symbols-outlined text-[12px]">
                lock
              </span>
              <span>
                Elevana AI can make mistakes. Messages are sent to Groq for AI processing.
              </span>
            </div>
          </form>
        </div>
      </div>

      <aside className="w-72 border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-background-dark hidden lg:flex flex-col">
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-base text-slate-800 dark:text-white">
              Source Documents
            </h2>
            <span className="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[9px] font-bold uppercase tracking-wider rounded-full border border-indigo-100 dark:border-indigo-900/30">
              Local Sources
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700/50">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                Context Coverage
              </span>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                {hasSourceContext ? "Ready" : scopedLecture ? "No text" : "General"}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 overflow-hidden">
              <div className={`bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full ${hasSourceContext ? "w-full" : scopedLecture ? "w-1/3" : "w-0"}`}></div>
            </div>
            <p className="text-[9px] text-slate-400 mt-1.5 text-center">
              {hasSourceContext ? "Answers include this lecture's notes." : scopedLecture ? "This lecture has no extracted source text yet." : "Open a lecture to scope chat context."}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <div className="space-y-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Lecture Materials
            </div>

            {appState.lectures.slice(0, 4).map((lecture) => (
              <button
                key={lecture.id}
                onClick={() => navigate(`/ai-tutor?lectureId=${lecture.id}`)}
                className={`w-full text-left group p-2.5 rounded-xl border hover:shadow-sm transition-all relative ${lecture.id === scopedLectureId ? "border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/10" : "border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-dark hover:border-indigo-100 dark:hover:border-indigo-900/30"}`}
              >
                <div className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0 text-red-500">
                    <span className="material-symbols-outlined text-[18px]">
                      {lecture.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {lecture.sourceName || lecture.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {lecture.status} - {lecture.course}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">
                        Local source
                      </span>
                      <span className="material-symbols-outlined text-[12px] text-slate-400">
                        check_circle
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Related Topics
            </div>
            <div className="space-y-1">
              {relatedTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleSuggestedAction(`Explain ${topic} with examples and a short quiz.`)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 group transition-colors"
                >
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">
                    {topic}
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-slate-300 group-hover:text-primary transition-colors">
                    chevron_right
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => navigate("/lectures")} className="w-full py-2.5 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-center gap-2 text-slate-500 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-400 transition-all">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Upload Material
          </button>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-background-dark">
          <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-xl p-3">
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0 text-orange-500 ring-4 ring-orange-50 dark:ring-orange-900/10">
                <span className="material-symbols-outlined text-[16px]">
                  lightbulb
                </span>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-0.5">
                  Study Tip
                </h4>
                <p className="text-[10px] leading-relaxed text-slate-600 dark:text-slate-400">
                  Open a processed lecture before chatting to include its notes
                  as tutor context.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default AITutor;
