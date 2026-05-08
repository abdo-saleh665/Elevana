import { useSyncExternalStore } from "react";
import { lectures as seedLectures, type LectureRecord } from "./data/lectures";
import {
  biologyMidtermQuestions,
  quizSummaries,
  type QuizQuestion,
} from "./data/quizzes";
import type { QuizAttempt } from "./quizAttempts";

const STORE_KEY = "elevana.v1.state";
const LEGACY_THEME_KEY = "theme";
const LEGACY_SESSION_KEY = "elevana.demo.session";
const LEGACY_ATTEMPTS_KEY = "elevana.quiz.attempts";

export type Plan = "free" | "pro";

export type LocalUser = {
  id: string;
  name: string;
  email: string;
  password?: string;
  provider?: "email" | "google" | "microsoft" | "apple";
  plan: Plan;
  createdAt: string;
  lastLoginAt: string;
};

export type LocalSettings = {
  theme: "light" | "dark";
  learningStyle: string;
  dailyReminders: boolean;
  quizAlerts: boolean;
};

export type VarkMode = "visual" | "auditory" | "readWrite" | "kinesthetic";

export type VarkScores = Record<VarkMode, number>;

export type OnboardingProfile = {
  completed: boolean;
  learningStyle: string;
  learningStyleScores?: VarkScores;
  learningStyleModes?: VarkMode[];
  learningStyleResultLabel?: string;
  weeklyCommitment: string;
  goalIntensity: number;
  completedAt?: string;
};

export type StoredLecture = LectureRecord & {
  uploadedAt: string;
  sourceName?: string;
  sourceSize?: number;
  sourceText?: string;
  lastAccessedAt?: string;
  studyProgress: number;
  bookmarked?: boolean;
  feedback?: "helpful" | "not-helpful";
  processingError?: string;
  generatedBy?: "seed" | "upload" | "ai";
};

export type LectureNotes = {
  lectureId: string;
  outline: { id: string; title: string; subItems?: string[] }[];
  summary: string;
  keyTakeaways: string[];
  body: { id: string; title: string; content: string }[];
  professorNotes: string[];
  updatedAt: string;
};

export type StoredQuiz = {
  id: string;
  lectureId?: string;
  title: string;
  description: string;
  course?: string;
  questions: QuizQuestion[];
  estimatedMinutes: number;
  priority: "high" | "normal";
  generatedBy?: "seed" | "lecture-ai" | "local-placeholder";
  createdAt: string;
  updatedAt: string;
};

export type ScheduleItem = {
  id: string;
  title: string;
  type: "lecture" | "quiz" | "study" | "focus" | "lab" | "task";
  startsAt: string;
  endsAt?: string;
  status: "upcoming" | "done" | "in_progress";
  course?: string;
  location?: string;
  lectureId?: string;
  quizId?: string;
  notes?: string;
};

export type FocusSession = {
  id: string;
  taskName: string;
  mode: "focus" | "short" | "long";
  secondsCompleted: number;
  completedAt: string;
};

export type AiChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type AiChatThread = {
  id: string;
  title: string;
  lectureId?: string;
  messages: AiChatMessage[];
  createdAt: string;
  updatedAt: string;
};

export type ElevanaState = {
  version: 1;
  sessionUserId: string | null;
  users: LocalUser[];
  settings: LocalSettings;
  onboarding: OnboardingProfile;
  lectureUploadsUsed: number;
  lectures: StoredLecture[];
  lectureNotes: Record<string, LectureNotes>;
  quizzes: StoredQuiz[];
  quizAttempts: QuizAttempt[];
  schedule: ScheduleItem[];
  focusSessions: FocusSession[];
  aiChats: AiChatThread[];
};

const listeners = new Set<() => void>();
let cachedState: ElevanaState | null = null;

const nowIso = () => new Date().toISOString();

export const createId = (prefix: string) => {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `${prefix}-${id}`;
};

const safeParse = <T,>(value: string | null): T | null => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const getStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
};

const withTime = (hours: number, minutes = 0, offsetDays = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

const estimateMinutes = (time: string) => {
  const match = time.match(/(\d+)/);
  return match ? Number(match[1]) : 15;
};

const LEARNING_STYLE_LABELS: Record<string, string> = {
  visual: "Visual",
  auditory: "Aural/Auditory",
  reading: "Read/write",
  readwrite: "Read/write",
  "read/write": "Read/write",
  kinesthetic: "Kinesthetic",
  "text-based (bullet points & summaries)": "Read/write",
  "visual (diagrams & mind maps)": "Visual",
  "auditory (text-to-speech optimized)": "Aural/Auditory",
};

const normalizeLearningStyleLabel = (value?: string) => {
  if (!value) {
    return "Read/write";
  }

  const normalized = value.trim();
  return LEARNING_STYLE_LABELS[normalized.toLowerCase()] || normalized;
};

const isVarkMode = (value: unknown): value is VarkMode => (
  value === "visual" ||
  value === "auditory" ||
  value === "readWrite" ||
  value === "kinesthetic"
);

const normalizeVarkModes = (value: unknown): VarkMode[] | undefined => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const modes = value.filter(isVarkMode);
  return modes.length ? modes : undefined;
};

const normalizeVarkScores = (value: unknown): VarkScores | undefined => {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const scores = value as Partial<Record<VarkMode, unknown>>;
  const normalizedScores: VarkScores = {
    visual: Number(scores.visual) || 0,
    auditory: Number(scores.auditory) || 0,
    readWrite: Number(scores.readWrite) || 0,
    kinesthetic: Number(scores.kinesthetic) || 0,
  };

  return Object.values(normalizedScores).some((score) => score > 0)
    ? normalizedScores
    : undefined;
};

const normalizeLecture = (lecture: LectureRecord, index: number): StoredLecture => ({
  ...lecture,
  uploadedAt: new Date(Date.now() - index * 86400000).toISOString(),
  sourceName: `${lecture.title}.${lecture.type.toLowerCase()}`,
  sourceSize: (index + 2) * 1024 * 1024,
  studyProgress: lecture.status === "ready" ? Math.max(25, 85 - index * 20) : 45,
  generatedBy: "seed",
});

const createNotesForLecture = (lecture: LectureRecord): LectureNotes => ({
  lectureId: lecture.id,
  outline: [
    { id: "introduction", title: "Introduction" },
    { id: "core-concepts", title: "Core Concepts", subItems: ["Definitions", "Examples"] },
    { id: "applications", title: "Applications" },
    { id: "summary", title: "Summary" },
  ],
  summary: lecture.description,
  keyTakeaways: [
    `${lecture.course} focuses on practical understanding, not memorization only.`,
    `The main idea is: ${lecture.description}`,
    "Use the quiz mode after reviewing the notes to check weak areas.",
  ],
  body: [
    {
      id: "introduction",
      title: "Introduction",
      content: `${lecture.title} introduces the key ideas from ${lecture.course}. Review the definitions first, then connect each concept to an example from class.`,
    },
    {
      id: "core-concepts",
      title: "Core Concepts",
      content: lecture.description,
    },
    {
      id: "applications",
      title: "Applications",
      content: "Apply these notes by explaining each heading out loud, then answering a short quiz without looking at the material.",
    },
    {
      id: "summary",
      title: "Summary",
      content: "Focus on the definitions, examples, and where you made mistakes in practice questions.",
    },
  ],
  professorNotes: [
    "Review this lecture again before attempting exam-style questions.",
    "Mark confusing sections and ask the AI Tutor for simpler examples.",
  ],
  updatedAt: nowIso(),
});

const createNotesFromSourceText = (lecture: StoredLecture): LectureNotes => {
  const sourceText = lecture.sourceText?.replace(/\s+/g, " ").trim() || lecture.description;
  const sentences = sourceText
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const summary = sentences.slice(0, 3).join(" ") || lecture.description;

  return {
    lectureId: lecture.id,
    outline: [
      { id: "overview", title: "Overview" },
      { id: "key-concepts", title: "Key Concepts", subItems: ["Definitions", "Examples"] },
      { id: "review-plan", title: "Review Plan" },
    ],
    summary,
    keyTakeaways: sentences.slice(3, 7).length
      ? sentences.slice(3, 7)
      : [
          `Review the central idea of ${lecture.title}.`,
          "Explain each key term without looking at the notes.",
          "Use a short quiz to identify weak areas.",
        ],
    body: [
      {
        id: "overview",
        title: "Overview",
        content: summary,
      },
      {
        id: "key-concepts",
        title: "Key Concepts",
        content: sentences.slice(7, 13).join(" ") || sourceText.slice(0, 900),
      },
      {
        id: "review-plan",
        title: "Review Plan",
        content: "Review the summary, write down the main concepts from memory, then use the quiz mode to test recall.",
      },
    ],
    professorNotes: [
      "MVP-generated notes should be checked against the original lecture material.",
    ],
    updatedAt: nowIso(),
  };
};

const makeGeneratedQuestion = (quizId: string, index: number, title: string): QuizQuestion => ({
  id: `${quizId}-q${index + 1}`,
  topic: title,
  text: `Which study action best helps you master ${title}?`,
  options: [
    { id: "opt1", text: "Skim once and move on" },
    { id: "opt2", text: "Practice recall and review mistakes" },
    { id: "opt3", text: "Only highlight every paragraph" },
    { id: "opt4", text: "Avoid testing yourself" },
  ],
  correctOptionId: "opt2",
  explanation: "Active recall and mistake review are stronger than passive rereading.",
});

const seedQuizzes = (): StoredQuiz[] =>
  quizSummaries.map((quiz) => ({
    id: quiz.id,
    lectureId: quiz.id === "data-structures-trees" ? "3" : quiz.id === "biology-midterm" ? undefined : undefined,
    title: quiz.title,
    description: quiz.description,
    course: quiz.id === "biology-midterm" ? "Biology 101" : undefined,
    questions:
      quiz.id === "biology-midterm"
        ? biologyMidtermQuestions
        : [0, 1, 2].map((index) => makeGeneratedQuestion(quiz.id, index, quiz.title)),
    estimatedMinutes: estimateMinutes(quiz.time),
    priority: quiz.status === "High Priority" ? "high" : "normal",
    generatedBy: "seed",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }));

const createSeedState = (): ElevanaState => {
  const storage = getStorage();
  const legacyTheme = storage?.getItem(LEGACY_THEME_KEY);
  const legacySession = safeParse<LocalUser>(storage?.getItem(LEGACY_SESSION_KEY) || null);
  const legacyAttempts = safeParse<QuizAttempt[]>(storage?.getItem(LEGACY_ATTEMPTS_KEY) || null) || [];
  const createdAt = nowIso();
  const user: LocalUser = legacySession || {
    id: "demo-user",
    name: "Alex Student",
    email: "alex.student@university.edu",
    password: "password123",
    provider: "email",
    plan: "free",
    createdAt,
    lastLoginAt: createdAt,
  };
  const lectures = seedLectures.map(normalizeLecture);

  return {
    version: 1,
    sessionUserId: legacySession?.id || null,
    users: [user],
    settings: {
      theme: legacyTheme === "dark" ? "dark" : "light",
      learningStyle: "Read/write",
      dailyReminders: false,
      quizAlerts: true,
    },
    onboarding: {
      completed: false,
      learningStyle: "Read/write",
      weeklyCommitment: "3-5 hours / week",
      goalIntensity: 75,
    },
    lectureUploadsUsed: lectures.length,
    lectures,
    lectureNotes: Object.fromEntries(lectures.map((lecture) => [lecture.id, createNotesForLecture(lecture)])),
    quizzes: seedQuizzes(),
    quizAttempts: legacyAttempts,
    schedule: [
      {
        id: "schedule-pathology",
        title: "Advance Pathology",
        type: "lecture",
        startsAt: withTime(9, 0),
        endsAt: withTime(10, 0),
        status: "done",
        course: "Biology 101",
        location: "Hall B",
        lectureId: "1",
      },
      {
        id: "schedule-microbiology-quiz",
        title: "Microbiology Quiz 3",
        type: "quiz",
        startsAt: withTime(10, 0),
        endsAt: withTime(10, 45),
        status: "upcoming",
        course: "Biology 101",
        quizId: "biology-midterm",
      },
      {
        id: "schedule-review-pharma",
        title: "Review Pharma",
        type: "study",
        startsAt: withTime(11, 0, 1),
        endsAt: withTime(12, 0, 1),
        status: "upcoming",
        location: "Study Group",
      },
      {
        id: "schedule-gross-anatomy",
        title: "Gross Anatomy II",
        type: "focus",
        startsAt: withTime(9, 30, 2),
        endsAt: withTime(10, 30, 2),
        status: "upcoming",
        notes: "Deep work block",
      },
      {
        id: "schedule-biochem-lab",
        title: "Bio-Chem Lab",
        type: "lab",
        startsAt: withTime(11, 0, 3),
        endsAt: withTime(12, 30, 3),
        status: "upcoming",
        location: "Lab 304",
      },
      {
        id: "task-lab-report",
        title: "Submit Lab Report",
        type: "task",
        startsAt: withTime(17, 0),
        status: "upcoming",
      },
    ],
    focusSessions: [],
    aiChats: [],
  };
};

const sanitizeState = (state: Partial<ElevanaState> | null): ElevanaState => {
  const seed = createSeedState();

  if (!state || state.version !== 1) {
    return seed;
  }

  const lectures = Array.isArray(state.lectures) ? state.lectures : seed.lectures;
  const lectureUploadsUsed = typeof state.lectureUploadsUsed === "number"
    ? Math.max(state.lectureUploadsUsed, lectures.length)
    : lectures.length;
  const storedSettings: Partial<LocalSettings> = state.settings || {};
  const storedOnboarding: Partial<OnboardingProfile> = state.onboarding || {};
  const learningStyleResultLabel = storedOnboarding.learningStyleResultLabel
    ? normalizeLearningStyleLabel(storedOnboarding.learningStyleResultLabel)
    : undefined;
  const learningStyle = normalizeLearningStyleLabel(
    learningStyleResultLabel ||
      storedOnboarding.learningStyle ||
      storedSettings.learningStyle,
  );

  return {
    ...seed,
    ...state,
    users: Array.isArray(state.users) && state.users.length ? state.users : seed.users,
    lectureUploadsUsed,
    lectures,
    quizzes: Array.isArray(state.quizzes) ? state.quizzes : seed.quizzes,
    quizAttempts: Array.isArray(state.quizAttempts) ? state.quizAttempts : seed.quizAttempts,
    schedule: Array.isArray(state.schedule) ? state.schedule : seed.schedule,
    focusSessions: Array.isArray(state.focusSessions) ? state.focusSessions : seed.focusSessions,
    aiChats: Array.isArray(state.aiChats) ? state.aiChats : seed.aiChats,
    lectureNotes: state.lectureNotes || seed.lectureNotes,
    settings: {
      ...seed.settings,
      ...storedSettings,
      learningStyle: normalizeLearningStyleLabel(storedSettings.learningStyle || learningStyle),
    },
    onboarding: {
      ...seed.onboarding,
      ...storedOnboarding,
      learningStyle,
      learningStyleScores: normalizeVarkScores(storedOnboarding.learningStyleScores),
      learningStyleModes: normalizeVarkModes(storedOnboarding.learningStyleModes),
      learningStyleResultLabel,
    },
  };
};

export const getAppState = (): ElevanaState => {
  if (cachedState) {
    return cachedState;
  }

  const storage = getStorage();
  const storedState = safeParse<ElevanaState>(storage?.getItem(STORE_KEY) || null);
  cachedState = sanitizeState(storedState);

  return cachedState;
};

export const setAppState = (state: ElevanaState) => {
  cachedState = sanitizeState(state);
  getStorage()?.setItem(STORE_KEY, JSON.stringify(cachedState));
  getStorage()?.setItem(LEGACY_THEME_KEY, cachedState.settings.theme);
  listeners.forEach((listener) => listener());
};

export const updateAppState = (updater: (state: ElevanaState) => ElevanaState) => {
  setAppState(updater(getAppState()));
};

export const subscribeAppState = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useAppState = () =>
  useSyncExternalStore(subscribeAppState, getAppState, getAppState);

export const getCurrentUser = (state = getAppState()) => {
  return state.users.find((user) => user.id === state.sessionUserId) || null;
};

export const upsertLectureNotes = (lecture: StoredLecture) => {
  updateAppState((state) => ({
    ...state,
    lectureNotes: {
      ...state.lectureNotes,
      [lecture.id]: state.lectureNotes[lecture.id] || createNotesForLecture(lecture),
    },
  }));
};

export const createLectureFromFile = (file: File): StoredLecture => {
  const extension = file.name.split(".").pop()?.toUpperCase();
  const type = extension === "DOCX" || extension === "MP3" || extension === "PDF" ? extension : "PDF";
  return {
    id: createId("lecture"),
    title: file.name.replace(/\.[^/.]+$/, ""),
    course: "Unassigned",
    term: "Local Upload",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    uploadedAt: nowIso(),
    status: "processing",
    progress: 15,
    type,
    description: `Processing ${file.name}. Elevana is extracting text and generating notes.`,
    readTime: "Processing",
    accuracyLabel: "Processing upload",
    icon: type === "MP3" ? "mic" : type === "DOCX" ? "description" : "picture_as_pdf",
    sourceName: file.name,
    sourceSize: file.size,
    studyProgress: 0,
    generatedBy: "upload",
  };
};

export const markLectureReady = (lectureId: string) => {
  updateAppState((state) => {
    const lectures = state.lectures.map((lecture) =>
      lecture.id === lectureId
        ? {
            ...lecture,
            status: "ready" as const,
            progress: 100,
            readTime: "10 min read",
            accuracyLabel: "Local notes generated",
            studyProgress: Math.max(lecture.studyProgress, 10),
            processingError: undefined,
          }
        : lecture,
    );
    const lecture = lectures.find((item) => item.id === lectureId);

    return {
      ...state,
      lectures,
      lectureNotes: lecture
        ? { ...state.lectureNotes, [lectureId]: state.lectureNotes[lectureId] || createNotesFromSourceText(lecture) }
        : state.lectureNotes,
    };
  });
};

export const createQuizForLecture = (lecture: StoredLecture): StoredQuiz => ({
  id: createId("quiz"),
  lectureId: lecture.id,
  title: `${lecture.title} Quiz`,
  description: `Local quiz generated from ${lecture.title}.`,
  course: lecture.course,
  questions: [0, 1, 2].map((index) => makeGeneratedQuestion(`${lecture.id}-quiz`, index, lecture.title)),
  estimatedMinutes: 10,
  priority: "normal",
  generatedBy: lecture.sourceText ? "local-placeholder" : "seed",
  createdAt: nowIso(),
  updatedAt: nowIso(),
});

export const removeLecture = (lectureId: string) => {
  updateAppState((state) => {
    const removedQuizIds = new Set(
      state.quizzes
        .filter((quiz) => quiz.lectureId === lectureId)
        .map((quiz) => quiz.id),
    );
    const lectureNotes = { ...state.lectureNotes };
    delete lectureNotes[lectureId];

    return {
      ...state,
      lectures: state.lectures.filter((lecture) => lecture.id !== lectureId),
      lectureNotes,
      quizzes: state.quizzes.filter((quiz) => quiz.lectureId !== lectureId),
      quizAttempts: state.quizAttempts.filter((attempt) => !removedQuizIds.has(attempt.quizId)),
      schedule: state.schedule.filter(
        (item) => item.lectureId !== lectureId && (!item.quizId || !removedQuizIds.has(item.quizId)),
      ),
      aiChats: state.aiChats.filter((thread) => thread.lectureId !== lectureId),
    };
  });
};

export const resetLocalAppState = () => {
  getStorage()?.clear();
  cachedState = createSeedState();
  if (typeof document !== "undefined") {
    document.documentElement.classList.remove("dark");
  }
  listeners.forEach((listener) => listener());
};
