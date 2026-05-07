<div align="center">
  <img src="public/favicon.svg" alt="Elevana logo" width="72" height="72" />
  <h1>Elevana</h1>
  <p><strong>AI-powered lecture notes, quizzes, study plans, and tutoring for university students.</strong></p>
</div>

Elevana turns readable lecture material into a focused study workspace. Upload lecture files, generate structured notes, practice with quizzes, plan review sessions, and ask an AI tutor questions with lecture context.

## Features

- AI lecture processing for readable `PDF`, `DOCX`, `TXT`, and `MD` files up to 20 MB.
- Structured study notes with summaries, key takeaways, outlines, and professor-style review notes.
- Quiz generation from lecture notes, plus active quiz attempts and results review.
- Context-aware AI tutor powered by Groq through local server-side endpoints.
- Dashboard, schedule, lecture library, settings, onboarding, and protected app routes.
- Local demo authentication, profile settings, plan limits, dark mode, and persisted app state.
- Responsive React UI with Tailwind CSS, Framer Motion, and Recharts.

> [!IMPORTANT]
> Authentication and app data are currently local-demo implementations backed by browser storage. Do not use the local password flow as production authentication without replacing it with a real backend and hashed credentials.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Framer Motion
- Recharts
- Groq API
- `pdf-parse`, `mammoth`, and `formidable` for local material processing

## Project Structure

```text
.
├── App.tsx                    # Route definitions and app shell
├── auth.tsx                   # Local demo auth and protected routes
├── localStore.ts              # Browser-persisted demo data model
├── vite.config.ts             # Vite config and local AI/API middleware
├── pages/                     # App pages and public routes
├── components/                # Shared UI components
├── components/quiz/           # Quiz library and active quiz UI
├── data/                      # Seed lectures and quizzes
├── public/                    # Static assets
└── .env.example               # Required AI environment variables
```

## Getting Started

### Prerequisites

- Node.js 20 or later recommended
- npm
- Groq API key for AI features

### Installation

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Set your Groq key:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
```

Start the development server:

```bash
npm run dev
```

Open the local Vite URL shown in your terminal.

## Demo Login

The seeded local account is:

```text
Email: alex.student@university.edu
Password: password123
```

You can also create a new local account from the signup page. All demo accounts are stored in browser storage.

## AI Endpoints

During local development, Vite middleware provides these server-side routes so the Groq API key is not exposed to the browser:

- `POST /api/chat`
- `POST /api/process-material`
- `POST /api/generate-quiz`

The middleware validates request sizes, limits chat message length, rate-limits local requests, extracts text from supported uploads, and falls back to local note/quiz generation when the AI provider is unavailable.

> [!NOTE]
> These routes currently live in `vite.config.ts` as development server middleware. For a full Vercel production deployment with working AI features, move the `/api/*` handlers into Vercel Functions or another backend. The frontend still builds as a static Vite app.

## Available Scripts

```bash
npm run dev        # Start the Vite dev server
npm run build      # Build the production frontend
npm run preview    # Preview the production build locally
npm run typecheck  # Run TypeScript checks
npm run audit      # Run npm audit
npm run check      # Run typecheck and production build
```

## Deploying To Vercel

1. Push the repository to GitHub.
2. Import the repository in Vercel.
3. Use Vercel's Vite defaults:
   Build command: `npm run build`
   Output directory: `dist`
4. Add environment variables in Vercel Project Settings:
   `GROQ_API_KEY` and `GROQ_MODEL`.
5. Add production API functions for `/api/chat`, `/api/process-material`, and `/api/generate-quiz` before relying on AI features in production.

## Security Notes

- `.env`, `.env.*`, and `.env.local` are ignored by Git; only `.env.example` is tracked.
- Keep `GROQ_API_KEY` server-side only. Do not prefix it with `VITE_`.
- Uploaded material is processed by local development middleware and capped at 20 MB.
- Local demo credentials are for development only.

## Roadmap

- Move AI routes to production-ready serverless functions.
- Replace local demo auth with a real authentication provider.
- Add persistent database-backed users, lectures, quizzes, schedules, and chat history.
- Add tests for lecture processing, quiz attempts, and protected routes.
