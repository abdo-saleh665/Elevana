import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { updateAppState, useAppState } from "../localStore";
import { useAuth } from "../auth";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const appState = useAppState();
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = React.useState(25 * 60);
  const [isActive, setIsActive] = React.useState(false);
  const [mode, setMode] = React.useState<"focus" | "short" | "long">("focus");
  const [taskName, setTaskName] = React.useState("Deep Work");
  const [sessions, setSessions] = React.useState(0);
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
  const readyLectures = appState.lectures.filter((lecture) => lecture.status === "ready");
  const quizScores = appState.quizAttempts.map((attempt) => attempt.score);
  const quizAverage = quizScores.length
    ? Math.round(quizScores.reduce((total, score) => total + score, 0) / quizScores.length)
    : 0;
  const totalLearningSeconds = appState.focusSessions.reduce((total, session) => total + session.secondsCompleted, 0);
  const totalLearningLabel = `${Math.floor(totalLearningSeconds / 3600)}h ${Math.floor((totalLearningSeconds % 3600) / 60)}m`;
  const learningData = [...Array(7)].map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    const seconds = appState.focusSessions
      .filter((session) => {
        const completedAt = new Date(session.completedAt).getTime();
        return completedAt >= dayStart.getTime() && completedAt <= dayEnd.getTime();
      })
      .reduce((total, session) => total + session.secondsCompleted, 0);

    return {
      name: date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2),
      fullName: date.toLocaleDateString("en-US", { weekday: "long" }),
      hours: Number((seconds / 3600).toFixed(1)),
      completed: seconds > 0,
    };
  });
  const visibleStreak = (() => {
    let count = 0;
    for (let index = learningData.length - 1; index >= 0; index -= 1) {
      if (!learningData[index].completed) break;
      count += 1;
    }
    return count;
  })();
  const recentLectures = [...appState.lectures]
    .sort((a, b) => new Date(b.lastAccessedAt || b.uploadedAt).getTime() - new Date(a.lastAccessedAt || a.uploadedAt).getTime())
    .slice(0, 2);
  const todaysSchedule = [...appState.schedule]
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
    .slice(0, 3);

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === "focus") {
        setSessions((prev) => (prev + 1) % 5); // Cycle after 4 sessions
        updateAppState((state) => ({
          ...state,
          focusSessions: [
            {
              id: crypto.randomUUID(),
              taskName,
              mode,
              secondsCompleted: 25 * 60,
              completedAt: new Date().toISOString(),
            },
            ...state.focusSessions,
          ].slice(0, 50),
        }));
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    switch (mode) {
      case "focus":
        setTimeLeft(25 * 60);
        break;
      case "short":
        setTimeLeft(5 * 60);
        break;
      case "long":
        setTimeLeft(15 * 60);
        break;
    }
  };

  const handleModeChange = (newMode: "focus" | "short" | "long") => {
    setMode(newMode);
    setIsActive(false);
    switch (newMode) {
      case "focus":
        setTimeLeft(25 * 60);
        setTaskName("Deep Work");
        break;
      case "short":
        setTimeLeft(5 * 60);
        setTaskName("Short Break");
        break;
      case "long":
        setTimeLeft(15 * 60);
        setTaskName("Long Break");
        break;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")} : ${secs.toString().padStart(2, "0")}`;
  };

  const calculateProgress = () => {
    const totalSeconds =
      mode === "focus" ? 25 * 60 : mode === "short" ? 5 * 60 : 15 * 60;
    const progress =
      ((totalSeconds - timeLeft) / totalSeconds) * (2 * Math.PI * 90);
    return progress;
  };

  return (
    <div className="max-w-[1600px] mx-auto p-6 lg:p-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2 text-sm font-medium">
            Welcome back, {user?.name || "Student"} <span className="text-amber-400">👋</span> Ready
            to learn something new?
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setStatusMessage("No new notifications right now. You're all caught up!")} className="relative p-2.5 rounded-xl text-slate-400 hover:text-primary hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group">
            <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">
              notifications
            </span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark animate-pulse"></span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800/50">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-700 dark:text-white">
                {user?.name || "Student"}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Student
              </p>
            </div>
            <button onClick={() => navigate("/settings")} className="relative cursor-pointer group" aria-label="Open settings">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden group-hover:border-primary transition-colors">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  {(user?.name || "Student").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-background-dark"></div>
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8 bg-surface-light dark:bg-surface-dark rounded-3xl p-1 shadow-card flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800 h-full border border-slate-100/50 dark:border-slate-800/50">
          <div className="flex-1 w-full p-3 flex flex-col items-center justify-center text-center group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 rounded-l-3xl transition-colors">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-[18px]">
                school
              </span>
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {appState.lectures.length}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Lectures
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                {readyLectures.length} ready
              </span>
            </div>
          </div>
          <div className="flex-1 w-full p-3 flex flex-col items-center justify-center text-center group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-[18px]">
                description
              </span>
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {appState.lectureNotes ? Object.keys(appState.lectureNotes).length : 0}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Notes
              </span>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                Pages
              </span>
            </div>
          </div>
          <div className="flex-1 w-full p-3 flex flex-col items-center justify-center text-center group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 rounded-r-3xl transition-colors">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-[18px]">
                check_circle
              </span>
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {quizAverage || 0}%
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Quiz Avg.
              </span>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">
                {appState.quizAttempts.length} attempts
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-primary-dark rounded-3xl p-4 shadow-card text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 z-10">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-2 py-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px] text-amber-400">
                local_fire_department
              </span>
              <span className="text-[9px] font-bold text-white">On Fire!</span>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500 rounded-full blur-[50px] opacity-30 group-hover:opacity-40 transition-opacity"></div>
          <div className="absolute -left-10 -top-10 w-24 h-24 bg-blue-500 rounded-full blur-[40px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative z-10">
            <p className="text-[10px] font-medium text-indigo-200">
              Study Streak
            </p>
            <h3 className="text-lg font-bold mt-0.5 mb-3">{visibleStreak} Day Streak</h3>
            <div className="flex justify-between items-center">
              {learningData.map((day, idx) => (
                <div
                  key={day.fullName}
                  className={`flex flex-col items-center gap-1 ${!day.completed ? "opacity-40" : ""}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${day.completed ? "bg-emerald-500 text-white shadow-emerald-500/20" : "border-1.5 border-dashed border-indigo-300/30"}`}
                  >
                    {day.completed && (
                      <span className="material-symbols-outlined text-[14px] font-bold">
                        check
                      </span>
                    )}
                  </div>
                  <span
                    className="text-[8px] font-bold text-indigo-200"
                  >
                    {day.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 shadow-card h-full flex flex-col border border-slate-100 dark:border-slate-800 hover:shadow-card-hover transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <span className="material-symbols-outlined text-primary dark:text-indigo-400 text-[20px]">
                schedule
              </span>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">
              Time Spent Learning
            </h3>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              {totalLearningLabel}
            </span>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {appState.focusSessions.length ? "Focus sessions saved locally." : "Start a focus session to build your learning chart."}
            </p>
          </div>
          <div className="flex-1 w-full h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={learningData}>
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
                  }}
                  labelFormatter={(label) => {
                    const item = learningData.find((d) => d.name === label);
                    return item ? item.fullName : label;
                  }}
                />
                <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                  {learningData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.completed ? "#6366f1" : "#e0e7ff"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-3xl p-6 shadow-card overflow-hidden relative border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <span className="material-symbols-outlined text-primary dark:text-indigo-400 text-[20px]">
                  calendar_today
                </span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                Today's Schedule
              </h3>
            </div>
            <button onClick={() => navigate("/schedule")} className="text-xs font-bold text-primary hover:text-primary-dark uppercase tracking-widest">
              Open Schedule
            </button>
          </div>

          <div className="space-y-4 relative z-10">
            {todaysSchedule.map((item) => (
              <button key={item.id} onClick={() => item.quizId ? navigate(`/active-quiz/${item.quizId}`) : item.lectureId ? navigate(`/lectures/${item.lectureId}`) : navigate("/schedule")} className="w-full flex items-center group text-left">
                <div className="w-16 text-xs text-slate-400 font-bold text-right pr-4">
                  {new Date(item.startsAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </div>
                <div className="flex-1 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 flex justify-between items-center hover:shadow-md transition-all cursor-pointer hover:border-blue-200 dark:hover:border-blue-800">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-2.5 rounded-xl text-blue-600 dark:text-blue-300 group-hover:scale-110 transition-transform duration-300">
                      <span className="material-symbols-outlined text-[20px]">
                        {item.type === "quiz" ? "quiz" : item.type === "focus" ? "timer" : "event"}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        {item.course || item.location || item.notes || "Local schedule item"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 px-2.5 py-1 rounded-lg">
                    {item.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently Studied */}
        <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-3xl p-6 shadow-card border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Recently Studied
            </h3>
            <button onClick={() => navigate("/lectures")} className="text-sm font-bold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors">
              View All
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="space-y-1">
            <div className="grid grid-cols-12 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-4">
              <div className="col-span-6">Course Name</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-3">Progress</div>
              <div className="col-span-1 text-right">Last Access</div>
            </div>

            {recentLectures.map((lecture) => (
              <button key={lecture.id} onClick={() => navigate(`/lectures/${lecture.id}`)} className="w-full bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-4 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group text-left">
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                      {lecture.course.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                        {lecture.title}
                      </h4>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
                    <span className="material-symbols-outlined text-[18px]">
                      {lecture.icon}
                    </span>
                    {lecture.type}
                  </div>
                  <div className="col-span-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${lecture.studyProgress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {lecture.studyProgress}%
                      </span>
                    </div>
                  </div>
                  <div className="col-span-1 text-right text-xs text-slate-400 font-medium">
                    {lecture.date}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Focus Timer */}
        <div className="lg:col-span-1 bg-[#1a1c2e] dark:bg-[#1a1c2e] rounded-3xl p-6 shadow-card text-white relative overflow-hidden flex flex-col justify-between h-full min-h-[360px] group">
          {/* Header */}
          <div className="flex justify-between items-start z-10 w-full">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="material-symbols-outlined text-[20px]">
                timer
              </span>
              <span className="text-sm font-medium">Focus</span>
            </div>
            <div
              className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" : "bg-slate-500"}`}
            ></div>
          </div>

          {/* Timer Circle */}
          <div className="relative z-10 flex flex-col items-center justify-center flex-1 my-4">
            <div className="relative w-56 h-56 flex items-center justify-center">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-3xl"></div>

              <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl">
                {/* Track */}
                <circle
                  cx="112"
                  cy="112"
                  r="90"
                  stroke="#2d3042"
                  strokeWidth="4"
                  fill="transparent"
                />
                {/* Progress */}
                <circle
                  cx="112"
                  cy="112"
                  r="90"
                  stroke={
                    mode === "focus"
                      ? "#4f46e5"
                      : mode === "short"
                        ? "#10b981"
                        : "#f59e0b"
                  }
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 90}
                  strokeDashoffset={calculateProgress()}
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_8px_rgba(79,70,229,0.5)] transition-all duration-1000 ease-linear"
                />
              </svg>

              {/* Time Display */}
              <div className="absolute flex flex-col items-center z-30 transform -translate-y-4">
                <div className="text-3xl font-bold tracking-wider text-white drop-shadow-2xl tabular-nums">
                  {formatTime(timeLeft)}
                </div>
                <input
                  type="text"
                  aria-label="Focus timer task"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="text-xs font-bold text-indigo-200 mt-2 uppercase tracking-widest bg-transparent text-center focus:outline-none focus:text-white transition-colors w-40 border-b border-transparent focus:border-indigo-400 placeholder-indigo-400/50 hover:text-white"
                  placeholder="ENTER TASK"
                />

                {/* Session Dots */}
                <div className="flex gap-1.5 mt-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i < sessions ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" : "bg-slate-700/50"}`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Controls - Positioned at bottom of circle */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-1/2 flex items-center gap-6 z-20">
                <button
                  onClick={resetTimer}
                  className="group relative w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                  title="Reset Timer"
                >
                  <span className="material-symbols-outlined text-[20px] group-hover:rotate-180 transition-transform duration-500">
                    refresh
                  </span>
                </button>
                <button
                  onClick={toggleTimer}
                  className="w-16 h-16 bg-[#4f46e5] hover:bg-[#4338ca] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(79,70,229,0.4)] hover:shadow-[0_6px_25px_rgba(79,70,229,0.6)] transition-all transform hover:scale-105 active:scale-95 border-[3px] border-[#1a1c2e]"
                >
                  <span className="material-symbols-outlined text-white text-3xl ml-1">
                    {isActive ? "pause" : "play_arrow"}
                  </span>
                </button>
                <div className="w-8"></div> {/* Spacer for balance */}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center gap-2 z-10 mt-8 px-2 w-full">
            <button
              onClick={() => handleModeChange("focus")}
              className={`flex-1 text-[10px] sm:text-xs font-semibold py-2.5 rounded-xl transition-all border ${mode === "focus" ? "bg-[#3730a3] text-white border-[#3730a3]" : "bg-[#2d3042] hover:bg-[#383b50] text-slate-300 border-white/5 hover:border-white/10"}`}
            >
              Focus
            </button>
            <button
              onClick={() => handleModeChange("short")}
              className={`flex-1 text-[10px] sm:text-xs font-semibold py-2.5 rounded-xl transition-all border ${mode === "short" ? "bg-[#3730a3] text-white border-[#3730a3]" : "bg-[#2d3042] hover:bg-[#383b50] text-slate-300 border-white/5 hover:border-white/10"}`}
            >
              Short
            </button>
            <button
              onClick={() => handleModeChange("long")}
              className={`flex-1 text-[10px] sm:text-xs font-semibold py-2.5 rounded-xl transition-all border ${mode === "long" ? "bg-[#3730a3] text-white border-[#3730a3]" : "bg-[#2d3042] hover:bg-[#383b50] text-slate-300 border-white/5 hover:border-white/10"}`}
            >
              Long
            </button>
          </div>
        </div>
      </div>
      {statusMessage && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-lg">
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
