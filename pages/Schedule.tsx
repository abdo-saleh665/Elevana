import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createId, updateAppState, useAppState } from "../localStore";

const Schedule: React.FC = () => {
  const navigate = useNavigate();
  const appState = useAppState();
  const [view, setView] = useState<"week" | "month">("week");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState("New Study Session");
  const [newSessionTime, setNewSessionTime] = useState("14:00");

  // Time slots for the calendar
  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);
  const weekDays = [...Array(7)].map((_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    const today = new Date();

    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.getDate(),
      fullDate: date,
      isToday: date.toDateString() === today.toDateString(),
    };
  });

  const filteredSchedule = appState.schedule
    .filter((item) => `${item.title} ${item.course || ""} ${item.location || ""}`.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  const upcomingTasks = filteredSchedule.filter((item) => item.type === "task" || item.status !== "done").slice(0, 4);
  const readyLectures = appState.lectures.filter((lecture) => lecture.status === "ready").length;
  const lectureGoalTotal = Math.max(appState.lectures.length, 1);
  const lectureGoalPercent = Math.round((readyLectures / lectureGoalTotal) * 100);
  const quizGoalTotal = Math.max(appState.quizzes.length, 1);
  const quizGoalDone = new Set(appState.quizAttempts.map((attempt) => attempt.quizId)).size;
  const quizGoalPercent = Math.round((quizGoalDone / quizGoalTotal) * 100);
  const weeklyGoalPercent = Math.round((lectureGoalPercent + quizGoalPercent) / 2);

  const formatRange = () => {
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay() + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  const moveDate = (amount: number, unit: "week" | "month") => {
    setSelectedDate((current) => {
      const next = new Date(current);
      if (unit === "week") next.setDate(next.getDate() + amount * 7);
      if (unit === "month") next.setMonth(next.getMonth() + amount);
      return next;
    });
  };

  const addSession = () => {
    const title = newSessionTitle.trim();
    if (!title) return;

    const startsAt = new Date(selectedDate);
    const [hours, minutes] = newSessionTime.split(":").map(Number);
    startsAt.setHours(Number.isFinite(hours) ? hours : 14, Number.isFinite(minutes) ? minutes : 0, 0, 0);
    const endsAt = new Date(startsAt);
    endsAt.setHours(startsAt.getHours() + 1, startsAt.getMinutes(), 0, 0);
    updateAppState((state) => ({
      ...state,
      schedule: [
        ...state.schedule,
        {
          id: createId("schedule"),
          title,
          type: "study",
          startsAt: startsAt.toISOString(),
          endsAt: endsAt.toISOString(),
          status: "upcoming",
          notes: "Added locally",
        },
      ],
    }));
    setStatusMessage("Session added locally.");
    setIsAddOpen(false);
    setNewSessionTitle("New Study Session");
  };

  const toggleTask = (id: string) => {
    updateAppState((state) => ({
      ...state,
      schedule: state.schedule.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "done" ? "upcoming" : "done" }
          : item,
      ),
    }));
  };

  const getEventStyle = (type: string) => {
    switch (type) {
      case "quiz": return { accent: "border-purple-500", badge: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400", icon: "timer" };
      case "study": return { accent: "border-emerald-500", badge: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400", icon: "group" };
      case "focus": return { accent: "border-slate-700", badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200", icon: "bolt" };
      case "lab": return { accent: "border-sky-500", badge: "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400", icon: "science" };
      default: return { accent: "border-indigo-500", badge: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400", icon: "location_on" };
    }
  };

  const getCalendarEventPosition = (startsAt: string, endsAt?: string) => {
    const start = new Date(startsAt);
    const end = endsAt ? new Date(endsAt) : new Date(start.getTime() + 60 * 60 * 1000);
    const dayIndex = weekDays.findIndex((day) => day.fullDate.toDateString() === start.toDateString());
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();
    const calendarStart = 9 * 60;
    const rowHeight = 100;
    const top = Math.max(0, ((startMinutes - calendarStart) / 60) * rowHeight + 8);
    const height = Math.max(56, ((Math.max(endMinutes, startMinutes + 30) - startMinutes) / 60) * rowHeight - 12);

    return { dayIndex, top, height };
  };

  return (
    <div className="flex h-full bg-background-light dark:bg-background-dark overflow-hidden font-body text-sm">
      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-neutral-200/60 dark:border-neutral-800/60 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-0.5 flex items-center">
              <div className="relative w-full max-w-[16rem] group">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] group-focus-within:text-primary transition-colors">
                  search
                </span>
                <input
                  type="text"
                  aria-label="Search schedule"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-transparent border-none text-xs focus:ring-0 outline-none text-slate-600 dark:text-slate-300 placeholder:text-slate-400/70"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex bg-neutral-100 dark:bg-neutral-800/50 p-1 rounded-lg border border-neutral-200 dark:border-neutral-700/50">
              <button
                onClick={() => setView("week")}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all shadow-sm ${
                  view === "week"
                    ? "bg-white dark:bg-surface-dark text-slate-800 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 shadow-none hover:bg-white/50 dark:hover:bg-white/5"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setView("month")}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                  view === "month"
                    ? "bg-white dark:bg-surface-dark text-slate-800 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-white/5"
                }`}
              >
                Month
              </button>
            </div>

            <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 mx-1"></div>

            <button onClick={() => setStatusMessage("Notifications checked locally.")} className="relative p-2 bg-white dark:bg-surface-dark rounded-lg border border-neutral-200 dark:border-neutral-800 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-all hover:shadow-md group">
              <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">
                notifications
              </span>
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white dark:border-surface-dark"></span>
            </button>

            <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/30">
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span className="hidden sm:inline">Add Session</span>
            </button>
          </div>
        </header>

        {/* Calendar Grid Header */}
        <div className="hidden md:block px-6 pt-5 pb-3 shrink-0 bg-background-light dark:bg-background-dark">
          <div className="flex justify-between items-end mb-4">
            <div>
              <div className="flex gap-2 items-center mb-0.5">
                <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/30 text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Current Week
                </span>
              </div>
              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
                {formatRange()}
              </h2>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => moveDate(-1, "week")} aria-label="Previous week" className="w-8 h-8 flex items-center justify-center bg-white dark:bg-surface-dark border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all hover:shadow-md hover:-translate-y-0.5 group">
                <span className="material-symbols-outlined text-[18px] text-slate-600 dark:text-slate-300 group-hover:scale-110 transition-transform">
                  chevron_left
                </span>
              </button>
              <button onClick={() => moveDate(1, "week")} aria-label="Next week" className="w-8 h-8 flex items-center justify-center bg-white dark:bg-surface-dark border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all hover:shadow-md hover:-translate-y-0.5 group">
                <span className="material-symbols-outlined text-[18px] text-slate-600 dark:text-slate-300 group-hover:scale-110 transition-transform">
                  chevron_right
                </span>
              </button>
            </div>
          </div>

          {/* Week Header Grid */}
          <div className="grid grid-cols-8 gap-0 bg-white dark:bg-surface-dark rounded-t-2xl border border-neutral-200 dark:border-neutral-800 border-b-0 shadow-sm relative z-10">
            <div className="col-span-1 border-r border-neutral-100 dark:border-neutral-800/50 p-3 flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/20 rounded-tl-2xl">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">
                Time
              </span>
            </div>
            {weekDays.map((day, idx) => (
              <div
                key={idx}
                className={`col-span-1 border-r border-neutral-100 dark:border-neutral-800/50 py-3 px-1 text-center relative group transition-colors hover:bg-slate-50/30 dark:hover:bg-slate-800/30 ${idx === 6 ? "border-r-0 rounded-tr-2xl" : ""}`}
              >
                {day.isToday && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>
                )}
                <span
                  className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${day.isToday ? "text-primary" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`}
                >
                  {day.day}
                </span>
                <div
                  className={`w-7 h-7 mx-auto flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                    day.isToday
                      ? "bg-primary text-white shadow-lg shadow-indigo-500/30 scale-110"
                      : "text-slate-700 dark:text-slate-200 group-hover:bg-slate-100 dark:group-hover:bg-slate-800"
                  }`}
                >
                  {day.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:hidden flex-1 overflow-y-auto p-4 space-y-3 bg-background-light dark:bg-background-dark">
          <div className="flex items-center justify-between mb-1">
            <div>
              <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/30 text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Current Week
              </span>
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white tracking-tight mt-1">
                {formatRange()}
              </h2>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Agenda
            </span>
          </div>

          {filteredSchedule.map((event) => {
            const style = getEventStyle(event.type);
            return (
            <article
              key={event.id}
              className={`bg-white dark:bg-surface-dark border-l-[3px] ${style.accent} rounded-xl p-4 shadow-soft border-y border-r border-slate-100 dark:border-slate-800`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded ${style.badge}`}>
                  {event.type}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {new Date(event.startsAt).toLocaleString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" })}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                {event.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mt-2">
                <span className="material-symbols-outlined text-[14px]">
                  {style.icon}
                </span>
                {event.location || event.notes || event.course || "Local session"}
              </div>
            </article>
          );
          })}
        </div>

        {/* Calendar Scroll Area */}
        <div className="hidden md:block flex-1 overflow-y-auto px-6 pb-6 custom-scroll">
          <div className="bg-white dark:bg-surface-dark rounded-b-2xl border border-neutral-200 dark:border-neutral-800 border-t-0 shadow-card relative min-h-[500px] overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>

            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-8 divide-x divide-neutral-100 dark:divide-neutral-800/50 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`h-full ${i === 0 ? "bg-slate-50/30 dark:bg-slate-900/20" : ""}`}
                ></div>
              ))}
            </div>

            {/* Time Rows */}
            {timeSlots.map((time, idx) => (
              <div
                key={idx}
                className="grid grid-cols-8 border-b border-neutral-100 dark:border-neutral-800/50 min-h-[100px]"
              >
                <div className="col-span-1 p-3 border-r border-neutral-100 dark:border-neutral-800/50 flex justify-end relative z-10">
                  <span className="text-[10px] font-medium text-slate-400 font-mono tracking-tight">
                    {time}
                  </span>
                </div>
                <div className="col-span-7"></div>
              </div>
            ))}

            {/* Absolute Events Layer */}
            <div className="hidden">
              {/* Column 1: Time Labels (Occupied) */}
              <div className="col-span-1"></div>

              {/* Column 2: Monday */}
              <div className="col-span-1 relative pointer-events-auto px-1 py-0.5">
                {/* Event 1 */}
                <div className="absolute top-[10px] left-1 right-1 bg-white dark:bg-surface-dark border-l-[3px] border-indigo-500 rounded-lg p-2 shadow-soft hover:shadow-premium hover:-translate-y-0.5 cursor-default transition-all duration-300 group z-10 border-y border-r border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[8px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider bg-indigo-50 dark:bg-indigo-900/20 px-1 py-0.5 rounded">
                      Lecture
                    </span>
                  </div>
                  <h4 className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight mb-0.5 group-hover:text-primary transition-colors">
                    Advance Pathology
                  </h4>
                  <div className="flex items-center gap-1 text-[9px] text-slate-500 dark:text-slate-400 font-medium">
                    <span className="material-symbols-outlined text-[12px]">
                      location_on
                    </span>
                    Hall B
                  </div>
                </div>
              </div>

              {/* Column 3: Tuesday */}
              <div className="col-span-1 relative pointer-events-auto px-1 py-0.5">
                {/* Event 2 */}
                <div className="absolute top-[115px] left-1 right-1 bg-white dark:bg-surface-dark border-l-[3px] border-purple-500 rounded-lg p-2 shadow-soft hover:shadow-premium hover:-translate-y-0.5 cursor-default transition-all duration-300 group z-10 border-y border-r border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[8px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider bg-purple-50 dark:bg-purple-900/20 px-1 py-0.5 rounded">
                      Quiz
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                  </div>
                  <h4 className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight mb-0.5 group-hover:text-purple-600 transition-colors">
                    Microbiology Quiz 3
                  </h4>
                  <div className="flex items-center gap-1 text-[9px] text-slate-500 dark:text-slate-400 font-medium">
                    <span className="material-symbols-outlined text-[12px]">
                      timer
                    </span>
                    45 min
                  </div>
                </div>
              </div>

              {/* Column 4: Wednesday */}
              <div className="col-span-1 relative pointer-events-auto px-1 py-0.5">
                {/* Event 3 */}
                <div className="absolute top-[215px] left-1 right-1 bg-white dark:bg-surface-dark border-l-[3px] border-emerald-500 rounded-lg p-2 shadow-soft hover:shadow-premium hover:-translate-y-0.5 cursor-default transition-all duration-300 group z-10 border-y border-r border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/20 px-1 py-0.5 rounded">
                      Study
                    </span>
                  </div>
                  <h4 className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight mb-0.5 group-hover:text-emerald-600 transition-colors">
                    Review Pharma
                  </h4>
                  <div className="flex items-center gap-1 text-[9px] text-slate-500 dark:text-slate-400 font-medium">
                    <span className="material-symbols-outlined text-[12px]">
                      group
                    </span>
                    Study Group
                  </div>
                </div>
              </div>

              {/* Column 5: Thursday */}
              <div className="col-span-1 relative pointer-events-auto px-1 py-0.5">
                {/* Event 4 */}
                <div className="absolute top-[30px] left-1 right-1 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-lg p-2 shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-0.5 cursor-default transition-all duration-300 group z-10 border border-slate-700">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] font-bold bg-white/20 px-1 py-0.5 rounded text-white uppercase tracking-wide backdrop-blur-sm">
                        Focus
                      </span>
                      <span className="material-symbols-outlined text-[12px] text-amber-400 animate-pulse">
                        bolt
                      </span>
                    </div>
                  </div>
                  <h4 className="text-[11px] font-bold leading-tight mb-1 text-white">
                    Gross Anatomy II
                  </h4>
                  <p className="text-[9px] text-slate-300 italic opacity-80">
                    "Master the muscular..."
                  </p>
                </div>
              </div>

              {/* Column 6: Friday */}
              <div className="col-span-1 relative pointer-events-auto px-1 py-0.5">
                {/* Event 5 */}
                <div className="absolute top-[215px] left-1 right-1 bg-white dark:bg-surface-dark border-l-[3px] border-sky-500 rounded-lg p-2 shadow-soft hover:shadow-premium hover:-translate-y-0.5 cursor-default transition-all duration-300 group z-10 border-y border-r border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[8px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider bg-sky-50 dark:bg-sky-900/20 px-1 py-0.5 rounded">
                      Lab
                    </span>
                  </div>
                  <h4 className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight mb-0.5 group-hover:text-sky-600 transition-colors">
                    Bio-Chem Lab
                  </h4>
                  <div className="flex items-center gap-1 text-[9px] text-slate-500 dark:text-slate-400 font-medium">
                    <span className="material-symbols-outlined text-[12px]">
                      science
                    </span>
                    Lab 304
                  </div>
                </div>
              </div>

              {/* Column 7: Saturday */}
              <div className="col-span-1"></div>

              {/* Column 8: Sunday */}
              <div className="col-span-1"></div>
            </div>

            <div className="absolute inset-0 grid grid-cols-8 pointer-events-none">
              <div className="col-span-1"></div>
              {weekDays.map((day, dayIndex) => (
                <div key={day.fullDate.toISOString()} className="col-span-1 relative pointer-events-auto px-1 py-0.5">
                  {filteredSchedule
                    .filter((event) => {
                      const position = getCalendarEventPosition(event.startsAt, event.endsAt);
                      return position.dayIndex === dayIndex;
                    })
                    .map((event) => {
                      const style = getEventStyle(event.type);
                      const position = getCalendarEventPosition(event.startsAt, event.endsAt);

                      return (
                        <button
                          key={event.id}
                          onClick={() => event.quizId ? navigate(`/active-quiz/${event.quizId}`) : event.lectureId ? navigate(`/lectures/${event.lectureId}`) : undefined}
                          className={`absolute left-1 right-1 text-left bg-white dark:bg-surface-dark border-l-[3px] ${style.accent} rounded-lg p-2 shadow-soft hover:shadow-premium hover:-translate-y-0.5 cursor-pointer transition-all duration-300 group z-10 border-y border-r border-slate-100 dark:border-slate-800 overflow-hidden`}
                          style={{ top: position.top, minHeight: position.height }}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-[8px] font-bold uppercase tracking-wider px-1 py-0.5 rounded ${style.badge}`}>
                              {event.type}
                            </span>
                            <span className="text-[8px] font-bold text-slate-400">
                              {new Date(event.startsAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                            </span>
                          </div>
                          <h4 className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight mb-0.5 group-hover:text-primary transition-colors">
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-1 text-[9px] text-slate-500 dark:text-slate-400 font-medium">
                            <span className="material-symbols-outlined text-[12px]">
                              {style.icon}
                            </span>
                            <span className="truncate">
                              {event.location || event.course || event.notes || "Local"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar Widgets */}
      <aside className="w-[280px] bg-white dark:bg-surface-dark border-l border-neutral-200 dark:border-neutral-800/60 flex flex-col overflow-y-auto hidden xl:flex shadow-[ -5px_0_30px_-10px_rgba(0,0,0,0.03)] z-10">
        {/* Mini Calendar */}
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-800/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold font-display text-slate-900 dark:text-white text-base">
              {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h3>
            <div className="flex gap-1">
               <button onClick={() => moveDate(-1, "month")} aria-label="Previous month" className="p-0.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors">
                <span className="material-symbols-outlined text-[18px] text-slate-400">
                  chevron_left
                </span>
              </button>
              <button onClick={() => moveDate(1, "month")} aria-label="Next month" className="p-0.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors">
                <span className="material-symbols-outlined text-[18px] text-slate-400">
                  chevron_right
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center mb-1">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, idx) => (
              <div
                key={idx}
                className="text-[9px] font-bold text-slate-400 py-1 uppercase tracking-wide"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 text-center gap-1">
            {/* Mock days */}
            <div className="text-[10px] text-slate-300 py-1.5">30</div>
            <div className="text-[10px] text-slate-300 py-1.5">31</div>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((d) => (
              <div
                key={d}
                className="text-[10px] font-bold text-slate-600 dark:text-slate-300 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-default transition-colors"
              >
                {d}
              </div>
            ))}
            <div className="text-[10px] font-bold text-white bg-primary rounded-md shadow-md shadow-indigo-500/40 py-1.5 cursor-default transform scale-105">
              13
            </div>
            {[14, 15, 16, 17, 18, 19, 20, 21, 22].map((d) => (
              <div
                key={d}
                className="text-[10px] font-bold text-slate-600 dark:text-slate-300 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-default transition-colors"
              >
                {d}
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Goals */}
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-800/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold font-display text-slate-900 dark:text-white text-sm">
              Weekly Goals
            </h3>
            <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-[9px] font-bold px-1.5 py-0.5 rounded">
              {weeklyGoalPercent}%
            </span>
          </div>

          <div className="mb-4 group">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1.5">
              <span className="group-hover:text-blue-600 transition-colors">
                Lecture Completion
              </span>
              <span className="text-slate-800 dark:text-white">{readyLectures}/{lectureGoalTotal}</span>
            </div>
            <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000"
                style={{ width: `${lectureGoalPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="group">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1.5">
              <span className="group-hover:text-indigo-600 transition-colors">
                Quiz Performance
              </span>
              <span className="text-slate-800 dark:text-white">{quizGoalDone}/{quizGoalTotal}</span>
            </div>
            <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000"
                style={{ width: `${quizGoalPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="p-5 flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold font-display text-slate-900 dark:text-white text-sm">
              Upcoming Tasks
            </h3>
            <button onClick={() => setSearchQuery("")} className="text-[9px] font-bold text-primary hover:text-primary-dark transition-colors bg-indigo-50 dark:bg-indigo-900/20 px-1.5 py-0.5 rounded">
              VIEW ALL
            </button>
          </div>

          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <button key={task.id} onClick={() => toggleTask(task.id)} className={`w-full text-left flex gap-3 items-start group p-1.5 -mx-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors ${task.status === "done" ? "opacity-60" : ""}`}>
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${task.status === "done" ? "bg-emerald-100 border-emerald-500 text-emerald-600" : "border-slate-300 dark:border-slate-600 group-hover:border-primary bg-white dark:bg-surface-dark"}`}>
                  {task.status === "done" && (
                    <span className="material-symbols-outlined text-[10px] font-bold">
                      check
                    </span>
                  )}
                </div>
                <div>
                  <h4 className={`text-[11px] font-bold text-slate-800 dark:text-white leading-tight group-hover:text-primary transition-colors ${task.status === "done" ? "line-through decoration-slate-400" : ""}`}>
                    {task.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {task.status === "done" ? "Completed" : new Date(task.startsAt).toLocaleString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" })}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* AI Promo */}
        <div className="p-5 pt-0">
          <div className="bg-gradient-to-br from-slate-900 via-primary-dark to-indigo-900 rounded-xl p-5 text-white shadow-premium relative overflow-hidden group border border-white/10">
            <div className="absolute top-3 right-3 p-1.5 bg-white/10 backdrop-blur-md rounded-lg opacity-50 group-hover:opacity-100 transition-all">
              <span className="material-symbols-outlined text-[20px] text-amber-400">
                auto_awesome
              </span>
            </div>

            <div className="relative z-10">
              <h3 className="font-bold text-sm mb-1 font-display">
                AI Study Assistant
              </h3>
              <p className="text-[10px] text-indigo-100 mb-4 opacity-80 leading-relaxed font-light">
                Generate custom summaries and quizzes from your lecture notes
                instantly.
              </p>
              <button onClick={() => navigate("/ai-tutor")} className="w-full py-2 bg-white text-primary-dark text-[10px] font-bold rounded-lg hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-1.5">
                <span>Try Elevana AI</span>
                <span className="material-symbols-outlined text-[14px]">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
      </aside>
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Add Study Session
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close add session">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Title
                <input
                  value={newSessionTitle}
                  onChange={(event) => setNewSessionTitle(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm normal-case tracking-normal text-slate-900 outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                />
              </label>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Start Time
                <input
                  type="time"
                  value={newSessionTime}
                  onChange={(event) => setNewSessionTime(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm normal-case tracking-normal text-slate-900 outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                />
              </label>
              <button onClick={addSession} className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary-dark">
                Save Session
              </button>
            </div>
          </div>
        </div>
      )}
      {statusMessage && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-lg">
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default Schedule;
