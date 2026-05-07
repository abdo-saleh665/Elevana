import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const content: Record<string, { title: string; body: string[] }> = {
  "/terms": {
    title: "Terms of Service",
    body: [
      "Elevana is currently a local-first MVP. Your use of this version is for study organization, note review, and quiz practice.",
      "Local data is stored in your browser until a database-backed account system is added.",
      "AI responses can be inaccurate, so always verify important academic material against your original lectures and official course sources.",
    ],
  },
  "/privacy": {
    title: "Privacy Policy",
    body: [
      "Most MVP data is stored locally in your browser using localStorage.",
      "When you use the AI Tutor, chat messages are sent to the configured local Groq middleware for AI processing.",
      "Uploaded files are processed by the local Vite MVP API. Elevana stores metadata, extracted text excerpts, and generated notes in browser storage.",
    ],
  },
  "/security": {
    title: "Security",
    body: [
      "This MVP keeps API keys server-side in the local Vite middleware and does not expose the Groq key to the browser.",
      "Local demo passwords are only suitable for development. A real deployment should use server-side authentication and hashed credentials.",
      "Use browser storage reset if you want to clear all local MVP data.",
    ],
  },
  "/help": {
    title: "Help Center",
    body: [
      "Upload lectures from My Lectures, open generated local notes, and create quizzes from lecture cards.",
      "Use Schedule to add local sessions and track tasks.",
      "Use Settings to update profile preferences, theme, local plan, and password.",
    ],
  },
  "/docs": {
    title: "Documentation",
    body: [
      "Elevana stores MVP data under the elevana.v1.state localStorage key.",
      "Main local entities include users, settings, onboarding, lectures, lecture notes, quizzes, attempts, schedule items, focus sessions, and AI chats.",
      "This structure is intentionally close to what a future database schema can provide.",
    ],
  },
  "/api-reference": {
    title: "API Reference",
    body: [
      "The current API surface includes local /api/chat, /api/process-material, and /api/generate-quiz endpoints provided by Vite middleware.",
      "Frontend state is local-only for now. Database APIs can later replace the localStore service without redesigning the UI.",
    ],
  },
  "/community": {
    title: "Community",
    body: [
      "Community features are represented locally for the MVP.",
      "Future versions can add shared decks, public notes, class groups, and instructor spaces.",
    ],
  },
  "/integrations": {
    title: "Integrations",
    body: [
      "The MVP supports local uploads and Groq-powered chat.",
      "Potential next integrations include Google Drive, Microsoft OneDrive, LMS imports, Stripe, and calendar sync.",
    ],
  },
  "/changelog": {
    title: "Changelog",
    body: [
      "Local-first app state added for MVP usage without a database.",
      "Lectures, quizzes, schedule, settings, auth, and AI chats are being wired to browser persistence.",
    ],
  },
};

const InfoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const page = content[location.pathname] || content["/help"];

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark px-6 py-10 text-slate-700 dark:text-slate-300">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark p-8 shadow-card">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-500 hover:text-primary dark:text-slate-400"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </button>
        <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white">
          {page.title}
        </h1>
        <div className="mt-8 space-y-5 text-base leading-8">
          {page.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </main>
  );
};

export default InfoPage;
