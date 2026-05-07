import { biologyMidtermQuestions, type QuizQuestion } from "./data/quizzes";
import { getAppState, updateAppState } from "./localStore";

export type QuizAttempt = {
  id: string;
  quizId: string;
  questions: QuizQuestion[];
  answers: Record<string, string>;
  score: number;
  correct: number;
  wrong: number;
  skipped: number;
  startedAt: string;
  submittedAt: string;
  elapsedSeconds: number;
};

const ATTEMPTS_KEY = "elevana.quiz.attempts";

const readAttempts = (): QuizAttempt[] => {
  return getAppState().quizAttempts;
};

const writeAttempts = (attempts: QuizAttempt[]) => {
  updateAppState((state) => ({ ...state, quizAttempts: attempts }));
  window.localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
};

export const createQuizAttempt = ({
  quizId,
  questions = biologyMidtermQuestions,
  answers,
  startedAt,
  elapsedSeconds,
}: {
  quizId: string;
  questions?: QuizQuestion[];
  answers: Record<string, string>;
  startedAt: string;
  elapsedSeconds: number;
}): QuizAttempt => {
  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  questions.forEach((question) => {
    const answer = answers[question.id];

    if (!answer) {
      skipped += 1;
    } else if (answer === question.correctOptionId) {
      correct += 1;
    } else {
      wrong += 1;
    }
  });

  const score = Math.round((correct / questions.length) * 100);
  const attempt: QuizAttempt = {
    id: crypto.randomUUID(),
    quizId,
    questions,
    answers,
    score,
    correct,
    wrong,
    skipped,
    startedAt,
    submittedAt: new Date().toISOString(),
    elapsedSeconds,
  };
  const attempts = readAttempts().filter((item) => item.id !== attempt.id);

  writeAttempts([attempt, ...attempts].slice(0, 20));

  return attempt;
};

export const getQuizAttempt = (attemptId: string | undefined) => {
  if (!attemptId) {
    return null;
  }

  return readAttempts().find((attempt) => attempt.id === attemptId) || null;
};

export const getLatestQuizAttempt = () => {
  return readAttempts()[0] || null;
};

export const formatElapsedTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return remainingSeconds === 0
    ? `${minutes}m`
    : `${minutes}m ${remainingSeconds}s`;
};
