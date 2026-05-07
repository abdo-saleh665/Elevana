## 💡 The Idea

**Elevana** is built to bridge the gap between complex university lectures and effective learning. 

The core mission is simple: **Take your raw study materials—whether they are lecture slides, textbook PDFs, or even audio recordings—and instantly turn them into structured knowledge.**

### What it does for you:
*   **Deciphers dense content**: Breaks down complex topics into clear, readable notes.
*   **Active Recall**: Generates personalized quizzes so you can test what you've learned immediately.
*   **Guided Study**: Creates intelligent plans to help you stay ahead of your exam schedule.

Elevana is your personal study companion, helping you stop drowning in data and start mastering your curriculum.

## Local AI Setup

The AI Tutor uses a local Vite dev-server endpoint at `/api/chat`, so the Groq API key is not exposed to the browser during local development.

1. Create a Groq API key from your Groq dashboard.
2. Copy `.env.example` to `.env.local`.
3. Replace `your_groq_api_key_here` with your real key.
4. Run `npm run dev` and open `/ai-tutor`.

Optional: change `GROQ_MODEL` in `.env.local` if Groq changes its free model list.

---

<div align="center">
  <p>© 2026 Elevana Inc.</p>
</div>


