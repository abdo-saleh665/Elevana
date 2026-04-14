import React, { useState } from "react";

const Schedule: React.FC = () => {
  const [view, setView] = useState<"week" | "month">("week");

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

  // Week days mock data
  const weekDays = [
    { day: "Mon", date: 13, isToday: false },
    { day: "Tue", date: 14, isToday: true },
    { day: "Wed", date: 15, isToday: false },
    { day: "Thu", date: 16, isToday: false },
    { day: "Fri", date: 17, isToday: false },
    { day: "Sat", date: 18, isToday: false },
    { day: "Sun", date: 19, isToday: false },
  ];

  return (
    <div className="flex h-full bg-background-light dark:bg-background-dark overflow-hidden font-body text-sm">
      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-neutral-200/60 dark:border-neutral-800/60 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-0.5 flex items-center">
              <div className="relative w-64 group">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] group-focus-within:text-primary transition-colors">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-1.5 bg-transparent border-none text-xs focus:ring-0 outline-none text-slate-600 dark:text-slate-300 placeholder:text-slate-400/70"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-neutral-100 dark:bg-neutral-800/50 p-1 rounded-lg border border-neutral-200 dark:border-neutral-700/50">
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

            <button className="relative p-2 bg-white dark:bg-surface-dark rounded-lg border border-neutral-200 dark:border-neutral-800 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-all hover:shadow-md group">
              <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">
                notifications
              </span>
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white dark:border-surface-dark"></span>
            </button>

            <button className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/30">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Session
            </button>
          </div>
        </header>

        {/* Calendar Grid Header */}
        <div className="px-6 pt-5 pb-3 shrink-0 bg-background-light dark:bg-background-dark">
          <div className="flex justify-between items-end mb-4">
            <div>
              <div className="flex gap-2 items-center mb-0.5">
                <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/30 text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Current Week
                </span>
              </div>
              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
                Nov 13 – 19, 2023
              </h2>
            </div>
            <div className="flex gap-1.5">
              <button className="w-8 h-8 flex items-center justify-center bg-white dark:bg-surface-dark border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all hover:shadow-md hover:-translate-y-0.5 group">
                <span className="material-symbols-outlined text-[18px] text-slate-600 dark:text-slate-300 group-hover:scale-110 transition-transform">
                  chevron_left
                </span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-white dark:bg-surface-dark border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all hover:shadow-md hover:-translate-y-0.5 group">
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

        {/* Calendar Scroll Area */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scroll">
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
            <div className="absolute inset-0 grid grid-cols-8 pointer-events-none">
              {/* Column 1: Time Labels (Occupied) */}
              <div className="col-span-1"></div>

              {/* Column 2: Monday */}
              <div className="col-span-1 relative pointer-events-auto px-1 py-0.5">
                {/* Event 1 */}
                <div className="absolute top-[10px] left-1 right-1 bg-white dark:bg-surface-dark border-l-[3px] border-indigo-500 rounded-lg p-2 shadow-soft hover:shadow-premium hover:-translate-y-0.5 cursor-pointer transition-all duration-300 group z-10 border-y border-r border-slate-100 dark:border-slate-800">
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
                <div className="absolute top-[115px] left-1 right-1 bg-white dark:bg-surface-dark border-l-[3px] border-purple-500 rounded-lg p-2 shadow-soft hover:shadow-premium hover:-translate-y-0.5 cursor-pointer transition-all duration-300 group z-10 border-y border-r border-slate-100 dark:border-slate-800">
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
                <div className="absolute top-[215px] left-1 right-1 bg-white dark:bg-surface-dark border-l-[3px] border-emerald-500 rounded-lg p-2 shadow-soft hover:shadow-premium hover:-translate-y-0.5 cursor-pointer transition-all duration-300 group z-10 border-y border-r border-slate-100 dark:border-slate-800">
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
                <div className="absolute top-[30px] left-1 right-1 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-lg p-2 shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 group z-10 border border-slate-700">
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
                <div className="absolute top-[215px] left-1 right-1 bg-white dark:bg-surface-dark border-l-[3px] border-sky-500 rounded-lg p-2 shadow-soft hover:shadow-premium hover:-translate-y-0.5 cursor-pointer transition-all duration-300 group z-10 border-y border-r border-slate-100 dark:border-slate-800">
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
          </div>
        </div>
      </div>

      {/* Right Sidebar Widgets */}
      <aside className="w-[280px] bg-white dark:bg-surface-dark border-l border-neutral-200 dark:border-neutral-800/60 flex flex-col overflow-y-auto hidden xl:flex shadow-[ -5px_0_30px_-10px_rgba(0,0,0,0.03)] z-10">
        {/* Mini Calendar */}
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-800/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold font-display text-slate-900 dark:text-white text-base">
              November 2023
            </h3>
            <div className="flex gap-1">
              <button className="p-0.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors">
                <span className="material-symbols-outlined text-[18px] text-slate-400">
                  chevron_left
                </span>
              </button>
              <button className="p-0.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors">
                <span className="material-symbols-outlined text-[18px] text-slate-400">
                  chevron_right
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center mb-1">
            {["M", "T", "W", "T", "F", "S", "S"].map((d) => (
              <div
                key={d}
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
                className="text-[10px] font-bold text-slate-600 dark:text-slate-300 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer transition-colors"
              >
                {d}
              </div>
            ))}
            <div className="text-[10px] font-bold text-white bg-primary rounded-md shadow-md shadow-indigo-500/40 py-1.5 cursor-pointer transform scale-105">
              13
            </div>
            {[14, 15, 16, 17, 18, 19, 20, 21, 22].map((d) => (
              <div
                key={d}
                className="text-[10px] font-bold text-slate-600 dark:text-slate-300 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer transition-colors"
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
              64%
            </span>
          </div>

          <div className="mb-4 group">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1.5">
              <span className="group-hover:text-blue-600 transition-colors">
                Lecture Completion
              </span>
              <span className="text-slate-800 dark:text-white">8/12</span>
            </div>
            <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000"
                style={{ width: "66%" }}
              ></div>
            </div>
          </div>

          <div className="group">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1.5">
              <span className="group-hover:text-indigo-600 transition-colors">
                Quiz Performance
              </span>
              <span className="text-slate-800 dark:text-white">4/5</span>
            </div>
            <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000"
                style={{ width: "80%" }}
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
            <button className="text-[9px] font-bold text-primary hover:text-primary-dark transition-colors bg-indigo-50 dark:bg-indigo-900/20 px-1.5 py-0.5 rounded">
              VIEW ALL
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3 items-start group cursor-pointer p-1.5 -mx-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
              <div className="w-4 h-4 rounded border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-primary transition-colors bg-white dark:bg-surface-dark"></div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight group-hover:text-primary transition-colors">
                  Submit Lab Report
                </h4>
                <p className="text-[10px] text-red-500 font-bold mt-0.5 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></span>
                  Today, 5:00 PM
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start group cursor-pointer p-1.5 -mx-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
              <div className="w-4 h-4 rounded border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-primary transition-colors bg-white dark:bg-surface-dark"></div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight group-hover:text-primary transition-colors">
                  Review Week 4 Flashcards
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Tomorrow, 10:00 AM
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start opacity-60 p-1.5 -mx-1.5">
              <div className="w-4 h-4 rounded bg-emerald-100 border-2 border-emerald-500 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 mt-0.5 text-emerald-600">
                <span className="material-symbols-outlined text-[10px] font-bold">
                  check
                </span>
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight line-through decoration-slate-400">
                  Anatomy Prep Read
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
                  Completed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Promo */}
        <div className="p-5 pt-0">
          <div className="bg-gradient-to-br from-slate-900 via-primary-dark to-indigo-900 rounded-xl p-5 text-white shadow-premium relative overflow-hidden group cursor-pointer border border-white/10">
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
              <button className="w-full py-2 bg-white text-primary-dark text-[10px] font-bold rounded-lg hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-1.5">
                <span>Try Elevana AI</span>
                <span className="material-symbols-outlined text-[14px]">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Schedule;
