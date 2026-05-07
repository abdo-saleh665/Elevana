import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useAppState } from "../../localStore";

interface QuizLibraryProps {
  onStartQuiz: (quizId: string) => void;
}

const QuizLibrary: React.FC<QuizLibraryProps> = ({ onStartQuiz }) => {
  const navigate = useNavigate();
  const appState = useAppState();
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const courses = Array.from(
    new Set(appState.quizzes.map((quiz) => quiz.course).filter(Boolean) as string[]),
  );

  const getLatestAttempt = (quizId: string) => {
    return appState.quizAttempts.find((attempt) => attempt.quizId === quizId) || null;
  };

  const filteredQuizzes = appState.quizzes.filter((quiz) => {
    const latestAttempt = getLatestAttempt(quiz.id);
    const status = latestAttempt ? "completed" : "active";
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && status === "active") ||
      (activeTab === "completed" && status === "completed") ||
      (activeTab === "drafts" && quiz.questions.length === 0);
    const matchesQuery = `${quiz.title} ${quiz.description} ${quiz.course || ""}`
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    const matchesCourse = courseFilter === "all" || quiz.course === courseFilter;

    return matchesTab && matchesQuery && matchesCourse;
  });

  const performanceData = appState.quizAttempts.slice(0, 7).reverse().map((attempt, index) => ({
    name: `A${index + 1}`,
    score: attempt.score,
  }));
  const chartData = performanceData.length ? performanceData : [{ name: "No attempts", score: 0 }];

  return (
    <div className="max-w-[1350px] mx-auto p-5 lg:p-8 font-body relative min-h-screen">
      {/* Premium Background Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30 bg-[radial-gradient(at_40%_20%,hsla(228,100%,74%,0.1)_0px,transparent_50%),radial-gradient(at_80%_0%,hsla(189,100%,56%,0.1)_0px,transparent_50%),radial-gradient(at_0%_50%,hsla(340,100%,76%,0.1)_0px,transparent_50%)]"></div>

      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-8 space-y-6">
          {/* Page Header */}
          <div className="mb-2">
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              Quiz Library
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your assessments and track your progress.
            </p>
          </div>

          {/* Top Search Bar & Filters */}
          <div className="bg-white dark:bg-surface-dark p-1.5 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">
                search
              </span>
              <input
                type="text"
                aria-label="Search quizzes"
                placeholder="Search quizzes by topic, lecture, or keyword..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-transparent text-sm font-medium text-neutral-800 dark:text-gray-200 outline-none placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-2 px-2 pb-2 sm:pb-0">
              <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block"></div>
              <button onClick={() => setCourseFilter(courseFilter === "all" && courses[0] ? courses[0] : "all")} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors">
                {courseFilter === "all" ? "All Courses" : courseFilter}
                <span className="material-symbols-outlined text-[18px]">
                  keyboard_arrow_down
                </span>
              </button>
              <button onClick={() => setShowFilters((current) => !current)} aria-label="Toggle quiz filters" className="p-1.5 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  tune
                </span>
              </button>
            </div>
          </div>
          {showFilters && (
            <div className="flex flex-wrap gap-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-surface-dark p-3 text-xs font-semibold">
              {["all", ...courses].map((course) => (
                <button
                  key={course}
                  onClick={() => setCourseFilter(course)}
                  className={`rounded-full px-3 py-1.5 transition-colors ${courseFilter === course ? "bg-primary text-white" : "bg-slate-50 text-slate-500 hover:text-primary dark:bg-slate-800 dark:text-slate-300"}`}
                >
                  {course === "all" ? "All Courses" : course}
                </button>
              ))}
            </div>
          )}

          {/* Available Quizzes Header & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-display font-bold text-neutral-800 dark:text-white">
              Available Quizzes
            </h2>
            <div className="flex gap-5 text-sm font-medium text-slate-400">
              {["Active", "Completed", "Drafts"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`${activeTab === tab.toLowerCase() || (activeTab === "all" && tab === "Active") ? "text-primary font-bold" : "hover:text-slate-600 dark:hover:text-slate-300"} transition-colors text-xs`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Quiz Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuizzes.map((quiz) => {
              const latestAttempt = getLatestAttempt(quiz.id);
              const isCompleted = Boolean(latestAttempt);

              return (
              <div
                key={quiz.id}
                className="bg-white dark:bg-surface-dark rounded-xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full"
              >
                {/* Header: Badge + Status + Menu */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {quiz.priority === "high" && !isCompleted && (
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-[9px] font-bold uppercase tracking-wide flex items-center gap-1 border border-orange-100 dark:border-orange-900/30">
                          <span className="material-symbols-outlined text-[10px]">
                            bolt
                          </span>
                          High Priority
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-[9px] font-bold flex items-center">
                          Not Started
                        </span>
                      </div>
                    )}
                    {quiz.priority !== "high" && !isCompleted && (
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold uppercase tracking-wide flex items-center gap-1 border border-emerald-100 dark:border-emerald-900/30">
                          <span className="material-symbols-outlined text-[10px]">
                            auto_awesome
                          </span>
                          Active
                        </span>
                      </div>
                    )}
                    {isCompleted && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold uppercase tracking-wide flex items-center gap-1 border border-emerald-100 dark:border-emerald-900/30">
                        <span className="material-symbols-outlined text-[10px]">
                          check_circle
                        </span>
                        Completed
                      </span>
                    )}
                    {quiz.generatedBy && quiz.generatedBy !== "seed" && (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 text-[9px] font-bold uppercase tracking-wide border border-indigo-100 dark:border-indigo-900/30">
                        {quiz.generatedBy === "lecture-ai" ? "Lecture AI" : "Local"}
                      </span>
                    )}
                  </div>
                  <button onClick={() => navigate(`/active-quiz/${quiz.id}`)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" aria-label={`Open ${quiz.title}`}>
                    <span className="material-symbols-outlined text-lg">
                      more_horiz
                    </span>
                  </button>
                </div>

                {/* Content */}
                <div className="mb-4 flex-1">
                  <h3 className="text-base font-display font-bold text-neutral-800 dark:text-gray-200 mb-1.5 leading-tight">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {quiz.description}
                  </p>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-3 mb-4">
                  {quiz.questions.length > 0 && (
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <span className="material-symbols-outlined text-[14px]">
                        format_list_numbered
                      </span>
                      {quiz.questions.length} Qs
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-[14px]">
                      schedule
                    </span>
                    {quiz.estimatedMinutes} Mins
                  </div>
                </div>

                {/* Action Button */}
                {isCompleted ? (
                  <button onClick={() => onStartQuiz(quiz.id)} className="w-full py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-slate-600 dark:text-slate-400 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-neutral-900 dark:hover:text-white transition-all flex items-center justify-center gap-2 group/btn">
                    Retake Quiz
                    <span className="material-symbols-outlined text-[16px] group-hover/btn:rotate-180 transition-transform duration-500">
                      refresh
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => onStartQuiz(quiz.id)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs text-white transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 group/btn ${
                      quiz.priority === "high"
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-orange-500/20"
                        : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-indigo-500/20"
                    }`}
                  >
                    {latestAttempt ? "Retake Quiz" : "Start Quiz"}
                    <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                )}
              </div>
            );
            })}
          </div>

          {/* Pagination */}
          <div className="flex justify-center pt-2">
            <nav className="flex items-center gap-2">
              <button onClick={() => setActiveTab("active")} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-surface-dark border border-neutral-200 dark:border-neutral-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-neutral-700 transition-all shadow-sm hover:shadow hover:-translate-x-0.5">
                <span className="material-symbols-outlined text-xs">
                  chevron_left
                </span>
              </button>
              <div className="flex items-center gap-1 bg-white dark:bg-surface-dark p-1 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <button onClick={() => setActiveTab("all")} className="w-7 h-7 flex items-center justify-center rounded-md bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transform scale-105">
                  1
                </button>
                <button onClick={() => setActiveTab("completed")} className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium text-xs">
                  2
                </button>
                <button onClick={() => setActiveTab("drafts")} className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium text-xs">
                  3
                </button>
              </div>
              <button onClick={() => setActiveTab("completed")} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-surface-dark border border-neutral-200 dark:border-neutral-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-neutral-700 transition-all shadow-sm hover:shadow hover:translate-x-0.5">
                <span className="material-symbols-outlined text-xs">
                  chevron_right
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-4 space-y-5">
          {/* Focus Areas - Compacted & Themed */}
          <div className="bg-gradient-to-br from-slate-900 to-primary-dark rounded-2xl p-4 text-white shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-display font-bold">Focus Areas</h3>
              <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                <span className="material-symbols-outlined text-[14px] text-indigo-200">
                  auto_awesome
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-white">
                  Recommended
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {/* Item 1 */}
              <button onClick={() => onStartQuiz("biology-midterm")} className="w-full text-left bg-white/5 border border-white/5 p-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] font-medium text-indigo-100">
                    Based on low score in Biology
                  </span>
                  <span className="material-symbols-outlined text-[10px]">
                    arrow_forward
                  </span>
                </div>
                <h4 className="font-bold text-xs mb-2 leading-snug">
                  Cellular Respiration Deep Dive
                </h4>
                <div className="flex items-center gap-2">
                  <span className="bg-rose-500/20 text-rose-200 text-[8px] font-bold px-1.5 py-0.5 rounded-md border border-rose-500/30">
                    Weak Area
                  </span>
                  <span className="text-[9px] text-indigo-100/70">15 mins</span>
                </div>
              </button>

              {/* Item 2 */}
              <button onClick={() => onStartQuiz("history-19th-century")} className="w-full text-left bg-white/5 border border-white/5 p-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] font-medium text-indigo-100">
                    Exam Prep: History 202
                  </span>
                  <span className="material-symbols-outlined text-[10px]">
                    arrow_forward
                  </span>
                </div>
                <h4 className="font-bold text-xs mb-2 leading-snug">
                  Industrial Revolution Key Events
                </h4>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500/20 text-amber-200 text-[8px] font-bold px-1.5 py-0.5 rounded-md border border-amber-500/30">
                    Upcoming Exam
                  </span>
                  <span className="text-[9px] text-indigo-100/70">25 mins</span>
                </div>
              </button>
            </div>
          </div>

          {/* Subject Progress */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary">
                donut_large
              </span>
              <h3 className="font-display font-bold text-neutral-800 dark:text-white">
                Subject Progress
              </h3>
            </div>

            <div className="space-y-6">
              {[
                {
                  name: "Biology 101",
                  progress: 85,
                  color: "bg-gradient-to-r from-[#2D2B75] to-indigo-600",
                  track: "Mastered 12/14 topics",
                },
                {
                  name: "Computer Science",
                  progress: 92,
                  color: "bg-gradient-to-r from-emerald-600 to-emerald-400",
                  track: "Mastered 18/20 topics",
                },
                {
                  name: "History 202",
                  progress: 64,
                  color: "bg-gradient-to-r from-amber-500 to-amber-400",
                  track: "Mastered 7/11 topics",
                },
              ].map((subject) => (
                <div key={subject.name}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold text-neutral-800 dark:text-gray-200">
                      {subject.name}
                    </span>
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      {subject.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden mb-1.5">
                    <div
                      className={`h-full ${subject.color} rounded-full`}
                      style={{ width: `${subject.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {subject.track}
                  </p>
                </div>
              ))}
            </div>

            <button onClick={() => navigate("/dashboard")} className="w-full mt-5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-slate-500 dark:text-slate-400 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-neutral-900 dark:hover:text-white transition-all flex items-center justify-center gap-2 group">
              View Detailed Report
              <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">
                arrow_right_alt
              </span>
            </button>
          </div>

          {/* Recent Performance */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  monitoring
                </span>
                <h3 className="font-display font-bold text-neutral-800 dark:text-white">
                  Recent Performance
                </h3>
              </div>
              <button onClick={() => setActiveTab("completed")} className="text-[10px] font-bold text-slate-400 hover:text-primary dark:hover:text-white transition-colors flex items-center gap-1 group">
                View All
                <span className="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                  chevron_right
                </span>
              </button>
            </div>

            {/* Chart */}
            <div className="h-48 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      color: "#1e293b",
                    }}
                    itemStyle={{ color: "#1e293b", fontWeight: "bold" }}
                    formatter={(value: number) => [`${value}%`, "Score"]}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === chartData.length - 1 ? "#6366f1" : "#e0e7ff"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Grades List */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  A
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                    Bio 101: Cells
                  </h4>
                  <p className="text-[10px] text-slate-400">2 days ago</p>
                </div>
                <div className="ml-auto text-xs font-bold text-emerald-600">
                  92%
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs">
                  B-
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                    CS: Algorithms
                  </h4>
                  <p className="text-[10px] text-slate-400">5 days ago</p>
                </div>
                <div className="ml-auto text-xs font-bold text-amber-600">
                  81%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizLibrary;
