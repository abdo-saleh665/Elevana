import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState, type StoredQuiz } from "../../localStore";
import { formatElapsedTime, type QuizAttempt } from "../../quizAttempts";

interface QuizLibraryProps {
  onStartQuiz: (quizId: string) => void;
}

type QuizTab = "all" | "active" | "completed" | "drafts";
type QuizSort = "priority" | "recent" | "duration" | "score";

const tabOptions: { id: QuizTab; label: string; icon: string }[] = [
  { id: "all", label: "All", icon: "apps" },
  { id: "active", label: "Ready", icon: "play_circle" },
  { id: "completed", label: "Completed", icon: "task_alt" },
  { id: "drafts", label: "Drafts", icon: "draft" },
];

const sortOptions: { id: QuizSort; label: string }[] = [
  { id: "priority", label: "Priority" },
  { id: "recent", label: "Recently Updated" },
  { id: "duration", label: "Shortest First" },
  { id: "score", label: "Score: Low to High" },
];

const statusTone = {
  ready:
    "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-900/40",
  completed:
    "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-900/40",
  draft:
    "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-900/40",
  priority:
    "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-900/40",
};

const getAttemptTime = (attempt: QuizAttempt | null) =>
  attempt ? new Date(attempt.submittedAt).getTime() : 0;

const getAverageScore = (attempts: QuizAttempt[]) => {
  if (!attempts.length) {
    return null;
  }

  return Math.round(
    attempts.reduce((total, attempt) => total + attempt.score, 0) /
      attempts.length,
  );
};

const QuizLibrary: React.FC<QuizLibraryProps> = ({ onStartQuiz }) => {
  const navigate = useNavigate();
  const appState = useAppState();
  const [activeTab, setActiveTab] = useState<QuizTab>("all");
  const [query, setQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [sortBy, setSortBy] = useState<QuizSort>("priority");
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  const attemptsByQuiz = useMemo(() => {
    const grouped = new Map<string, QuizAttempt[]>();

    appState.quizAttempts.forEach((attempt) => {
      const attempts = grouped.get(attempt.quizId) || [];
      grouped.set(attempt.quizId, [...attempts, attempt]);
    });

    grouped.forEach((attempts, quizId) => {
      grouped.set(
        quizId,
        [...attempts].sort(
          (a, b) =>
            new Date(b.submittedAt).getTime() -
            new Date(a.submittedAt).getTime(),
        ),
      );
    });

    return grouped;
  }, [appState.quizAttempts]);

  const getLatestAttempt = (quizId: string) => attemptsByQuiz.get(quizId)?.[0] || null;
  const selectedQuiz = selectedQuizId
    ? appState.quizzes.find((quiz) => quiz.id === selectedQuizId) || null
    : null;
  const selectedAttempt = selectedQuiz ? getLatestAttempt(selectedQuiz.id) : null;

  const courses = useMemo(
    () => {
      const courseSet = new Set<string>();
      appState.quizzes.forEach((quiz) => {
        if (quiz.course) {
          courseSet.add(quiz.course);
        }
      });

      return Array.from(courseSet).sort((a, b) => a.localeCompare(b));
    },
    [appState.quizzes],
  );

  const counts = useMemo(() => {
    return appState.quizzes.reduce(
      (summary, quiz) => {
        const isDraft = quiz.questions.length === 0;
        const isCompleted = Boolean(getLatestAttempt(quiz.id));

        summary.all += 1;
        if (isDraft) summary.drafts += 1;
        if (isCompleted) summary.completed += 1;
        if (!isDraft && !isCompleted) summary.active += 1;

        return summary;
      },
      { all: 0, active: 0, completed: 0, drafts: 0 },
    );
  }, [appState.quizzes, attemptsByQuiz]);

  const filteredQuizzes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return appState.quizzes
      .filter((quiz) => {
        const latestAttempt = getLatestAttempt(quiz.id);
        const isDraft = quiz.questions.length === 0;
        const isCompleted = Boolean(latestAttempt);
        const matchesTab =
          activeTab === "all" ||
          (activeTab === "active" && !isDraft && !isCompleted) ||
          (activeTab === "completed" && isCompleted) ||
          (activeTab === "drafts" && isDraft);
        const matchesQuery = `${quiz.title} ${quiz.description} ${quiz.course || ""}`
          .toLowerCase()
          .includes(normalizedQuery);
        const matchesCourse = courseFilter === "all" || quiz.course === courseFilter;

        return matchesTab && matchesQuery && matchesCourse;
      })
      .sort((a, b) => {
        const aAttempt = getLatestAttempt(a.id);
        const bAttempt = getLatestAttempt(b.id);

        if (sortBy === "recent") {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }

        if (sortBy === "duration") {
          return a.estimatedMinutes - b.estimatedMinutes;
        }

        if (sortBy === "score") {
          return (aAttempt?.score ?? 101) - (bAttempt?.score ?? 101);
        }

        const priorityDelta =
          Number(b.priority === "high") - Number(a.priority === "high");
        if (priorityDelta !== 0) return priorityDelta;

        return getAttemptTime(bAttempt) - getAttemptTime(aAttempt);
      });
  }, [activeTab, appState.quizzes, attemptsByQuiz, courseFilter, query, sortBy]);

  const averageScore = getAverageScore(appState.quizAttempts);
  const completedCount = counts.completed;
  const readyCount = counts.active;
  const highPriorityCount = appState.quizzes.filter(
    (quiz) => quiz.priority === "high" && !getLatestAttempt(quiz.id),
  ).length;
  const totalQuestions = appState.quizzes.reduce(
    (total, quiz) => total + quiz.questions.length,
    0,
  );

  const performanceData = appState.quizAttempts
    .slice(0, 7)
    .reverse()
    .map((attempt, index) => ({
      name: `A${index + 1}`,
      score: attempt.score,
    }));
  const chartData = performanceData.length
    ? performanceData
    : [{ name: "No attempts", score: 0 }];

  const weakAttempt = [...appState.quizAttempts].sort((a, b) => a.score - b.score)[0] || null;
  const upcomingQuiz =
    appState.schedule.find((item) => item.type === "quiz" && item.quizId)?.quizId ||
    null;
  const recommendations = [
    weakAttempt
      ? {
          id: "weak-attempt",
          label: "Lowest recent score",
          title:
            appState.quizzes.find((quiz) => quiz.id === weakAttempt.quizId)
              ?.title || "Review weak quiz",
          meta: `${weakAttempt.score}% score`,
          icon: "trending_down",
          quizId: weakAttempt.quizId,
        }
      : null,
    upcomingQuiz
      ? {
          id: "upcoming",
          label: "Scheduled soon",
          title:
            appState.quizzes.find((quiz) => quiz.id === upcomingQuiz)?.title ||
            "Upcoming quiz",
          meta: "Calendar linked",
          icon: "event_upcoming",
          quizId: upcomingQuiz,
        }
      : null,
    appState.quizzes.find((quiz) => quiz.priority === "high")
      ? {
          id: "priority",
          label: "High priority",
          title: appState.quizzes.find((quiz) => quiz.priority === "high")!.title,
          meta: "Recommended focus",
          icon: "priority_high",
          quizId: appState.quizzes.find((quiz) => quiz.priority === "high")!.id,
        }
      : null,
  ].filter(Boolean) as {
    id: string;
    label: string;
    title: string;
    meta: string;
    icon: string;
    quizId: string;
  }[];

  const clearFilters = () => {
    setQuery("");
    setCourseFilter("all");
    setActiveTab("all");
    setSortBy("priority");
  };

  const openQuiz = (quiz: StoredQuiz) => {
    if (quiz.questions.length === 0) {
      setSelectedQuizId(quiz.id);
      return;
    }

    onStartQuiz(quiz.id);
  };

  const openResult = (attempt: QuizAttempt | null) => {
    if (!attempt) {
      return;
    }

    navigate(`/quiz/results/${attempt.id}`, { state: attempt });
  };

  return (
    <div className="mx-auto max-w-[1420px] px-4 py-5 font-body sm:px-6 lg:px-8">
      <div className="mb-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-surface-dark">
        <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="p-5 sm:p-7">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary dark:border-indigo-900/40 dark:bg-indigo-900/20 dark:text-indigo-300">
                  <span className="material-symbols-outlined text-[15px]">
                    quiz
                  </span>
                  Quiz Command Center
                </div>
                <h1 className="font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                  Quizzes
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Start practice, inspect results, and focus on the assessments that need attention.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/lectures")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                <span className="material-symbols-outlined text-[18px]">
                  add_circle
                </span>
                Create From Lecture
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                {
                  label: "Ready",
                  value: readyCount,
                  icon: "play_circle",
                  tone: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
                },
                {
                  label: "Completed",
                  value: completedCount,
                  icon: "task_alt",
                  tone: "text-sky-600 bg-sky-50 dark:bg-sky-900/20",
                },
                {
                  label: "Average",
                  value: averageScore === null ? "--" : `${averageScore}%`,
                  icon: "monitoring",
                  tone: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20",
                },
                {
                  label: "Questions",
                  value: totalQuestions,
                  icon: "format_list_numbered",
                  tone: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-neutral-200 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-slate-900/40"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </span>
                    <span
                      className={`material-symbols-outlined rounded-lg p-1.5 text-[18px] ${stat.tone}`}
                    >
                      {stat.icon}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-slate-950 dark:text-white">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-200 bg-slate-50 p-5 dark:border-neutral-800 dark:bg-slate-900/40 lg:border-l lg:border-t-0">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  Recent Performance
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Last {Math.min(appState.quizAttempts.length, 7)} attempts
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("completed")}
                className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-white dark:text-indigo-300 dark:hover:bg-slate-800"
              >
                View All
              </button>
            </div>
            <div className="flex h-44 items-end gap-2 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-slate-950/30">
              {chartData.map((entry, index) => {
                const height = Math.max(8, entry.score);
                const barTone =
                  entry.score >= 80
                    ? "bg-emerald-500"
                    : entry.score >= 60
                      ? "bg-amber-500"
                      : index === chartData.length - 1
                        ? "bg-indigo-500"
                        : "bg-slate-300 dark:bg-slate-700";

                return (
                  <div key={`${entry.name}-${index}`} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                    <div className="flex h-28 w-full items-end rounded-lg bg-slate-100 px-1.5 py-1 dark:bg-slate-900">
                      <div
                        className={`w-full rounded-md ${barTone}`}
                        style={{ height: `${height}%` }}
                        aria-label={`${entry.name}: ${entry.score}%`}
                        title={`${entry.name}: ${entry.score}%`}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      {entry.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="min-w-0 space-y-5">
          <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-surface-dark">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
                  search
                </span>
                <input
                  id="quiz-search"
                  name="quiz-search"
                  type="text"
                  aria-label="Search quizzes"
                  placeholder="Search by quiz, topic, or course"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-11 w-full rounded-xl border border-transparent bg-slate-50 pl-10 pr-10 text-sm font-medium text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-indigo-900 dark:focus:bg-slate-900"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[17px]">
                      close
                    </span>
                  </button>
                )}
              </div>

              <label className="relative">
                <span className="sr-only">Filter by course</span>
                <select
                  id="quiz-course-filter"
                  name="quiz-course-filter"
                  value={courseFilter}
                  onChange={(event) => setCourseFilter(event.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-neutral-200 bg-white px-3 pr-9 text-sm font-semibold text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-indigo-300 dark:border-neutral-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-800"
                >
                  <option value="all">All courses</option>
                  {courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
                  expand_more
                </span>
              </label>

              <label className="relative">
                <span className="sr-only">Sort quizzes</span>
                <select
                  id="quiz-sort"
                  name="quiz-sort"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as QuizSort)}
                  className="h-11 w-full appearance-none rounded-xl border border-neutral-200 bg-white px-3 pr-9 text-sm font-semibold text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-indigo-300 dark:border-neutral-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-800"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
                  sort
                </span>
              </label>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {tabOptions.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`}
                  aria-pressed={activeTab === tab.id}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {tab.icon}
                  </span>
                  {tab.label}
                  <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[10px]">
                    {counts[tab.id]}
                  </span>
                </button>
              ))}

              {(query || courseFilter !== "all" || activeTab !== "all" || sortBy !== "priority") && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-300"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    restart_alt
                  </span>
                  Reset
                </button>
              )}
            </div>
          </div>

          {filteredQuizzes.length ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filteredQuizzes.map((quiz) => {
                const latestAttempt = getLatestAttempt(quiz.id);
                const isCompleted = Boolean(latestAttempt);
                const isDraft = quiz.questions.length === 0;
                const attemptCount = attemptsByQuiz.get(quiz.id)?.length || 0;
                const statusLabel = isDraft
                  ? "Draft"
                  : isCompleted
                    ? "Completed"
                    : quiz.priority === "high"
                      ? "High Priority"
                      : "Ready";
                const statusClass = isDraft
                  ? statusTone.draft
                  : isCompleted
                    ? statusTone.completed
                    : quiz.priority === "high"
                      ? statusTone.priority
                      : statusTone.ready;

                return (
                  <article
                    key={quiz.id}
                    className="flex min-h-[260px] flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-surface-dark"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusClass}`}
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {isDraft
                              ? "edit_note"
                              : isCompleted
                                ? "check_circle"
                                : quiz.priority === "high"
                                  ? "bolt"
                                  : "play_circle"}
                          </span>
                          {statusLabel}
                        </span>
                        {quiz.generatedBy && quiz.generatedBy !== "seed" && (
                          <span className="rounded-lg border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-900/20 dark:text-indigo-300">
                            {quiz.generatedBy === "lecture-ai" ? "Lecture AI" : "Local"}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedQuizId(quiz.id)}
                        aria-label={`Open details for ${quiz.title}`}
                        className="grid h-9 w-9 flex-none place-items-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          more_horiz
                        </span>
                      </button>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-display text-lg font-bold leading-snug text-slate-950 dark:text-white">
                        {quiz.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        {quiz.description}
                      </p>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/50">
                        <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Questions
                        </div>
                        <div className="mt-1 font-bold text-slate-900 dark:text-white">
                          {quiz.questions.length}
                        </div>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/50">
                        <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Time
                        </div>
                        <div className="mt-1 font-bold text-slate-900 dark:text-white">
                          {quiz.estimatedMinutes}m
                        </div>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/50">
                        <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Best
                        </div>
                        <div className="mt-1 font-bold text-slate-900 dark:text-white">
                          {latestAttempt ? `${latestAttempt.score}%` : "--"}
                        </div>
                      </div>
                    </div>

                    {latestAttempt && (
                      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span className="material-symbols-outlined text-[16px]">
                          history
                        </span>
                        {attemptCount} attempt{attemptCount === 1 ? "" : "s"} · last{" "}
                        {formatElapsedTime(latestAttempt.elapsedSeconds)}
                      </div>
                    )}

                    <div className="mt-5 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openQuiz(quiz)}
                        disabled={isDraft}
                        className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                          isDraft
                            ? "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                            : quiz.priority === "high" && !isCompleted
                              ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg shadow-amber-500/20 hover:-translate-y-0.5"
                              : "bg-gradient-to-r from-indigo-600 to-slate-900 text-white shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 dark:from-indigo-500 dark:to-sky-500"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {isCompleted ? "refresh" : isDraft ? "lock" : "play_arrow"}
                        </span>
                        {isCompleted ? "Retake" : isDraft ? "Needs Questions" : "Start"}
                      </button>
                      <button
                        type="button"
                        onClick={() => openResult(latestAttempt)}
                        disabled={!latestAttempt}
                        className={`grid h-12 w-12 place-items-center rounded-xl border text-sm transition-colors ${
                          latestAttempt
                            ? "border-neutral-200 text-slate-500 hover:bg-slate-50 hover:text-primary dark:border-neutral-800 dark:text-slate-300 dark:hover:bg-slate-800"
                            : "cursor-not-allowed border-neutral-100 text-slate-300 dark:border-neutral-800 dark:text-slate-700"
                        }`}
                        aria-label={`View results for ${quiz.title}`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          analytics
                        </span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center shadow-sm dark:border-neutral-800 dark:bg-surface-dark">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                <span className="material-symbols-outlined text-3xl">
                  search_off
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                No quizzes match these filters
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                Clear the search or switch tabs to see the full quiz library.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950"
              >
                <span className="material-symbols-outlined text-[18px]">
                  restart_alt
                </span>
                Clear Filters
              </button>
            </div>
          )}
        </section>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-surface-dark">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-bold text-slate-950 dark:text-white">
                  Focus Queue
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Suggested next practice
                </p>
              </div>
              {highPriorityCount > 0 && (
                <span className="rounded-lg bg-rose-50 px-2 py-1 text-[10px] font-bold text-rose-600 dark:bg-rose-900/20 dark:text-rose-300">
                  {highPriorityCount} urgent
                </span>
              )}
            </div>

            <div className="space-y-2">
              {recommendations.slice(0, 3).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onStartQuiz(item.quizId)}
                  className="w-full rounded-xl border border-neutral-200 bg-slate-50 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white hover:shadow-sm dark:border-neutral-800 dark:bg-slate-900/50 dark:hover:border-indigo-900 dark:hover:bg-slate-900"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      <span className="material-symbols-outlined text-[15px]">
                        {item.icon}
                      </span>
                      {item.label}
                    </span>
                    <span className="material-symbols-outlined text-[16px] text-slate-400">
                      arrow_forward
                    </span>
                  </div>
                  <div className="line-clamp-1 text-sm font-bold text-slate-950 dark:text-white">
                    {item.title}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-400">
                    {item.meta}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-surface-dark">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-slate-950 dark:text-white">
                Latest Results
              </h2>
              <button
                type="button"
                onClick={() => setActiveTab("completed")}
                className="text-xs font-bold text-primary hover:underline dark:text-indigo-300"
              >
                View All
              </button>
            </div>

            {appState.quizAttempts.length ? (
              <div className="space-y-3">
                {appState.quizAttempts.slice(0, 4).map((attempt) => {
                  const quiz = appState.quizzes.find((item) => item.id === attempt.quizId);
                  const gradeTone =
                    attempt.score >= 80
                      ? "bg-emerald-100 text-emerald-700"
                      : attempt.score >= 60
                        ? "bg-amber-100 text-amber-700"
                        : "bg-rose-100 text-rose-700";

                  return (
                    <button
                      key={attempt.id}
                      type="button"
                      onClick={() => openResult(attempt)}
                      className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/60"
                    >
                      <span
                        className={`grid h-10 w-10 flex-none place-items-center rounded-xl text-sm font-bold ${gradeTone}`}
                      >
                        {attempt.score}%
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-slate-900 dark:text-white">
                          {quiz?.title || "Quiz result"}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-400">
                          {attempt.correct} correct · {formatElapsedTime(attempt.elapsedSeconds)}
                        </span>
                      </span>
                      <span className="material-symbols-outlined text-[18px] text-slate-400">
                        chevron_right
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                Complete a quiz to unlock result history here.
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-surface-dark">
            <h2 className="font-display text-base font-bold text-slate-950 dark:text-white">
              Course Coverage
            </h2>
            <div className="mt-4 space-y-4">
              {(courses.length ? courses : ["Unassigned"]).map((course) => {
                const courseQuizzes = appState.quizzes.filter((quiz) =>
                  course === "Unassigned" ? !quiz.course : quiz.course === course,
                );
                const completed = courseQuizzes.filter((quiz) =>
                  Boolean(getLatestAttempt(quiz.id)),
                ).length;
                const progress = courseQuizzes.length
                  ? Math.round((completed / courseQuizzes.length) * 100)
                  : 0;

                return (
                  <button
                    key={course}
                    type="button"
                    onClick={() => setCourseFilter(course)}
                    className="w-full rounded-xl p-2 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/60"
                  >
                    <div className="mb-2 flex items-end justify-between">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {course}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {progress}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="mt-1.5 text-[11px] font-semibold text-slate-400">
                      {completed}/{courseQuizzes.length} completed
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950 dark:border-neutral-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              View Detailed Report
              <span className="material-symbols-outlined text-[17px]">
                arrow_right_alt
              </span>
            </button>
          </div>
        </aside>
      </div>

      {selectedQuiz && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="quiz-details-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-label="Close quiz details"
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setSelectedQuizId(null)}
          />
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-surface-dark">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Quiz Details
                </div>
                <h2
                  id="quiz-details-title"
                  className="font-display text-2xl font-bold leading-tight text-slate-950 dark:text-white"
                >
                  {selectedQuiz.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedQuizId(null)}
                aria-label="Close details"
                className="grid h-9 w-9 flex-none place-items-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>

            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
              {selectedQuiz.description}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                ["Course", selectedQuiz.course || "Unassigned"],
                ["Questions", `${selectedQuiz.questions.length}`],
                ["Time", `${selectedQuiz.estimatedMinutes} minutes`],
                ["Latest Score", selectedAttempt ? `${selectedAttempt.score}%` : "No attempts"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/50"
                >
                  <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    {label}
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setSelectedQuizId(null);
                  openQuiz(selectedQuiz);
                }}
                disabled={selectedQuiz.questions.length === 0}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  selectedQuiz.questions.length === 0
                    ? "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                    : "bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {selectedAttempt ? "refresh" : "play_arrow"}
                </span>
                {selectedAttempt ? "Retake Quiz" : "Start Quiz"}
              </button>
              <button
                type="button"
                onClick={() => openResult(selectedAttempt)}
                disabled={!selectedAttempt}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition-colors ${
                  selectedAttempt
                    ? "border-neutral-200 text-slate-600 hover:bg-slate-50 hover:text-primary dark:border-neutral-800 dark:text-slate-300 dark:hover:bg-slate-800"
                    : "cursor-not-allowed border-neutral-100 text-slate-300 dark:border-neutral-800 dark:text-slate-700"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  analytics
                </span>
                View Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizLibrary;
