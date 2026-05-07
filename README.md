# Elevana

Elevana is an AI-powered educational platform designed to streamline the learning process. It helps students and lifelong learners manage lectures, generate structured notes, interact with an AI tutor, and test their knowledge with intelligently generated quizzes.

## Key Features

- **Lecture Management**: Upload and organize your study materials (PDF, DOCX, MP3).
- **AI-Powered Notes**: Automatically generate summaries, key takeaways, and structured outlines from your lectures.
- **AI Tutor**: Interactive chat experience to ask questions and clarify complex concepts in real-time.
- **Smart Quizzes**: Test your knowledge with quizzes generated directly from your study materials.
- **Learning Schedule**: Keep track of your lectures, quizzes, and focus sessions in a unified view.
- **Focus Mode**: Pomodoro-style timer to help you stay productive during study blocks.
- **Dark/Light Mode**: Aesthetic and comfortable viewing experience for any time of day.

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- **State Management**: Custom SyncExternalStore with LocalStorage (Local-first architecture)
- **AI Engine**: [GROQ](https://groq.com/) (Llama 3.1 8B)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Document Parsing**: Mammoth (DOCX), PDF-Parse (PDF)

## Prerequisites

- **Node.js**: v20 or higher
- **Package Manager**: npm or yarn
- **API Key**: A GROQ API key is required for AI features.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/abdo-saleh665/Elevana.git
cd Elevana
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add your GROQ API key:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Architecture

### Directory Structure

```
├── components/         # Reusable UI components (Modals, Charts, Layouts)
├── pages/              # Page components (Dashboard, AITutor, Lectures, etc.)
├── data/               # Seed data for initial app state
├── auth.tsx            # Authentication logic and ProtectedRoute component
├── localStore.ts       # Core state management and LocalStorage synchronization
├── types.ts            # Global TypeScript interfaces
├── App.tsx             # Main application entry and routing
├── index.css           # Global styles and Tailwind directives
└── vite.config.ts      # Vite configuration
```

### Data Flow & State Management

Elevana follows a **local-first** architecture. All user data, including uploaded lectures, notes, and quiz attempts, are stored directly in the browser's `localStorage`.

1. **State Persistence**: The `localStore.ts` file uses `useSyncExternalStore` to create a reactive state that stays in sync with `localStorage`.
2. **AI Integration**: Browser requests go to `/api/*` server endpoints, which call Groq without exposing `GROQ_API_KEY` to the client.
3. **Authentication**: A demo-friendly authentication system manages user sessions and onboarding state locally.

### Database Schema (Local Representation)

The `ElevanaState` object stored in `localStorage` includes:

- `users`: Array of local user profiles.
- `lectures`: Metadata and source text for uploaded materials.
- `lectureNotes`: Generated content for each lecture.
- `quizzes`: Array of questions and metadata for study sessions.
- `quizAttempts`: History of user performance.
- `schedule`: Calendar events and tasks.
- `aiChats`: History of conversations with the AI Tutor.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Builds the application for production |
| `npm run preview` | Previews the production build locally |
| `npm run typecheck` | Runs TypeScript compiler checks |
| `npm run check` | Runs typechecks and build sequentially |

## Deployment

Elevana builds as a Vite React app and includes Vercel API functions for AI chat, material processing, and quiz generation.

### Deploy to Vercel

1. Push your code to GitHub.
2. Connect your repository to Vercel.
3. Add `GROQ_API_KEY` to the Environment Variables section in the Vercel dashboard.
4. Optionally add `GROQ_MODEL` if you want to override the default model.
5. Vercel will automatically detect Vite and deploy the frontend plus `/api` functions.

## Contributing

Contributions are welcome! If you have suggestions for new features or improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
