import React from 'react';

const Schedule: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#0f172a] relative z-10">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800/60 shrink-0 bg-white/50 dark:bg-[#0f172a]/50 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">October 2023</h1>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-1">Fall Semester • Week 4</p>
                </div>
                 <div className="flex items-center gap-4">
                    <button className="group bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-premium hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all duration-300 border border-indigo-500/20">
                        <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">colors_spark</span>
                        AI Optimize
                    </button>
                </div>
            </div>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto relative custom-scroll">
            <div className="grid grid-cols-8 border-b border-slate-100 dark:border-slate-800/60 sticky top-0 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur z-20 shadow-sm">
                <div className="col-span-1 border-r border-slate-100 dark:border-slate-800/60 py-5 px-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center">GMT-4</div>
                {['Mon 16', 'Tue 17', 'Wed 18', 'Thu 19', 'Fri 20', 'Sat 21', 'Sun 22'].map((date, idx) => (
                    <div key={idx} className={`col-span-1 py-4 text-center border-r border-slate-100 dark:border-slate-800/60 ${idx === 2 ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                         <span className={`block text-[11px] font-semibold uppercase tracking-wider mb-1 ${idx === 2 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400'}`}>{date.split(' ')[0]}</span>
                         <span className={`block text-xl font-bold ${idx === 2 ? 'w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30' : 'text-slate-700 dark:text-slate-300'}`}>{date.split(' ')[1]}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-8 flex-1 relative min-h-[960px] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]">
                {/* Time Column */}
                <div className="col-span-1 border-r border-slate-100 dark:border-slate-800/60 bg-white dark:bg-[#0f172a]">
                    {['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM'].map((time) => (
                         <div key={time} className="h-24 border-b border-slate-50 dark:border-slate-800/30 px-3 py-2 text-[10px] font-medium text-slate-400 text-right font-mono">{time}</div>
                    ))}
                </div>

                {/* Event Columns Mockup */}
                 <div className="col-span-1 border-r border-slate-100 dark:border-slate-800/60 relative p-1.5">
                    <div className="absolute top-[100px] left-1.5 right-1.5 h-[80px] bg-white dark:bg-[#1e293b] border-l-[3px] border-sky-500 rounded-lg p-3 shadow-soft hover:shadow-float cursor-pointer transition-all duration-300 z-10 group/card ring-1 ring-slate-100 dark:ring-slate-700/50">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider bg-sky-50 dark:bg-sky-900/30 px-1.5 py-0.5 rounded">Lecture</span>
                        </div>
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">Intro to Psychology</h3>
                         <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">schedule</span> 9:00 - 10:15 AM
                        </p>
                    </div>
                 </div>

                 <div className="col-span-1 border-r border-slate-100 dark:border-slate-800/60 relative p-1.5">
                     <div className="absolute top-[580px] left-1.5 right-1.5 h-[60px] bg-white dark:bg-[#1e293b] border-l-[3px] border-purple-500 rounded-lg p-3 shadow-soft hover:shadow-float cursor-pointer transition-all duration-300 z-10 ring-1 ring-slate-100 dark:ring-slate-700/50">
                         <div className="flex items-center gap-2 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Quiz</span>
                        </div>
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">Calculus II Assessment</h3>
                     </div>
                 </div>

                 {/* Current Day Column */}
                 <div className="col-span-1 border-r border-slate-100 dark:border-slate-800/60 bg-indigo-50/20 dark:bg-indigo-900/5 relative p-1.5">
                    {/* Current Time Line */}
                    <div className="absolute top-[340px] -left-[12.5%] right-0 z-20 flex items-center pointer-events-none w-[112.5%]">
                        <div className="w-[11%] text-right pr-3 text-[10px] font-bold text-indigo-600 bg-white dark:bg-[#0f172a] inline-block py-0.5 rounded-r">11:15 AM</div>
                        <div className="flex-1 h-px bg-indigo-500 relative shadow-[0_0_8px_rgba(99,102,241,0.5)]">
                            <div className="absolute -top-[3px] left-0 w-2 h-2 rounded-full bg-indigo-600 shadow-sm border border-white dark:border-slate-900"></div>
                        </div>
                    </div>

                    <div className="absolute top-[350px] left-1 right-1 h-[100px] bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-lg p-3 shadow-premium hover:scale-[1.02] cursor-pointer transition-all duration-300 z-20 border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[9px] font-bold bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm tracking-wide">REVIEW</span>
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        </div>
                        <h3 className="text-sm font-bold leading-tight mb-1">Biology 101 Notes</h3>
                        <p className="text-[10px] text-indigo-100 mt-2 flex items-center gap-1.5 font-medium opacity-90">
                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                            11:30 - 1:00 PM
                        </p>
                    </div>
                 </div>
                 
                 {/* Remaining Columns */}
                 <div className="col-span-1 border-r border-slate-100 dark:border-slate-800/60"></div>
                 <div className="col-span-1 border-r border-slate-100 dark:border-slate-800/60"></div>
                 <div className="col-span-1 border-r border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50"></div>
                 <div className="col-span-1 bg-slate-50/50 dark:bg-slate-900/50"></div>
            </div>
        </div>
    </div>
  );
};

export default Schedule;