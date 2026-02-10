import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Mo', hours: 4 },
  { name: 'Tu', hours: 6.5 },
  { name: 'We', hours: 3 },
  { name: 'Th', hours: 8.5 },
  { name: 'Fr', hours: 2 },
  { name: 'Sa', hours: 1 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-[1600px] mx-auto p-6 lg:p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2 text-sm font-medium">
                    Welcome back, Alex <span className="text-amber-400">✨</span> Ready to learn something new?
                </p>
            </div>
            <div className="flex items-center gap-4">
                <button className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow-md">
                    <span className="material-symbols-outlined text-[20px]">upload_file</span>
                    Quick Upload
                </button>
                <button className="bg-primary dark:bg-indigo-600 hover:bg-primary-dark dark:hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40">
                    <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                    AI Tutor
                </button>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            <div className="lg:col-span-8 bg-surface-light dark:bg-surface-dark rounded-3xl p-1 shadow-card flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800 h-full border border-slate-100/50 dark:border-slate-800/50">
                 <div className="flex-1 w-full p-6 flex flex-col items-center justify-center text-center group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 rounded-l-3xl transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="material-symbols-outlined text-2xl">school</span>
                    </div>
                    <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">42</span>
                    <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Lectures</span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">+3 new</span>
                    </div>
                </div>
                 <div className="flex-1 w-full p-6 flex flex-col items-center justify-center text-center group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="material-symbols-outlined text-2xl">description</span>
                    </div>
                    <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">128</span>
                    <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Notes</span>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Pages</span>
                    </div>
                </div>
                 <div className="flex-1 w-full p-6 flex flex-col items-center justify-center text-center group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 rounded-r-3xl transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="material-symbols-outlined text-2xl">check_circle</span>
                    </div>
                    <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">85%</span>
                    <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Quiz Avg.</span>
                        <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">Top 10%</span>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-primary-dark rounded-3xl p-6 shadow-card text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 z-10">
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-amber-400">local_fire_department</span>
                        <span className="text-xs font-bold text-white">On Fire!</span>
                    </div>
                </div>
                 <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500 rounded-full blur-[60px] opacity-30 group-hover:opacity-40 transition-opacity"></div>
                 <div className="absolute -left-10 -top-10 w-32 h-32 bg-blue-500 rounded-full blur-[50px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                 <div className="relative z-10">
                    <p className="text-sm font-medium text-indigo-200">Study Streak</p>
                    <h3 className="text-2xl font-bold mt-1 mb-6">5 Day Streak</h3>
                    <div className="flex justify-between items-center">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                            <div key={day} className={`flex flex-col items-center gap-2 ${idx > 4 ? 'opacity-40' : ''}`}>
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg ${idx < 4 ? 'bg-emerald-500 text-white shadow-emerald-500/20' : idx === 4 ? 'bg-white text-indigo-600 shadow-white/20 animate-pulse ring-2 ring-indigo-300 ring-opacity-50' : 'border-2 border-dashed border-indigo-300/30'}`}>
                                    {idx <= 4 && <span className="material-symbols-outlined text-[18px] font-bold">check</span>}
                                </div>
                                <span className={`text-[10px] font-bold ${idx === 4 ? 'text-white' : 'text-indigo-200'}`}>{day}</span>
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
                        <span className="material-symbols-outlined text-primary dark:text-indigo-400 text-[20px]">schedule</span>
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg">Time Spent Learning</h3>
                </div>
                <div className="mb-6">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">12h 45m</span>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Excellent! You're ahead of schedule.</p>
                </div>
                 <div className="flex-1 w-full h-40">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                            <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 3 ? '#6366f1' : '#e0e7ff'} />
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
                            <span className="material-symbols-outlined text-primary dark:text-indigo-400 text-[20px]">calendar_today</span>
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">Today's Schedule</h3>
                    </div>
                 </div>

                 <div className="space-y-4 relative z-10">
                    <div className="flex items-center group">
                        <div className="w-16 text-xs text-slate-400 font-bold text-right pr-4">09:30 AM</div>
                        <div className="flex-1 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 flex justify-between items-center hover:shadow-md transition-all cursor-pointer hover:border-blue-200 dark:hover:border-blue-800">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-50 dark:bg-blue-900/30 p-2.5 rounded-xl text-blue-600 dark:text-blue-300 group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-[20px]">psychology</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Neural Networks Basics</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Lecture 4 • PDF Processed</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 px-2.5 py-1 rounded-lg">Done</span>
                        </div>
                    </div>

                    <div className="flex items-center group">
                        <div className="w-16 text-xs text-primary font-bold text-right pr-4">11:00 AM</div>
                        <div className="flex-1 bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-900/20 dark:to-slate-800/50 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-4 flex justify-between items-center shadow-lg shadow-indigo-100/50 dark:shadow-none cursor-pointer relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                            <div className="flex items-center gap-4">
                                <div className="bg-indigo-100 dark:bg-indigo-800 p-2.5 rounded-xl text-primary dark:text-indigo-200 group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-[20px]">play_circle</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Deep Learning Fundamentals</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Video Lecture • In Progress</p>
                                </div>
                            </div>
                            <button className="text-xs bg-primary text-white px-4 py-2 rounded-lg shadow-sm font-semibold hover:bg-primary-dark transition-all transform hover:-translate-y-0.5">Resume</button>
                        </div>
                    </div>

                    <div className="flex items-center group opacity-80 hover:opacity-100 transition-opacity">
                        <div className="w-16 text-xs text-slate-400 font-bold text-right pr-4">02:00 PM</div>
                        <div className="flex-1 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex justify-between items-center hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-100 dark:bg-slate-700 p-2.5 rounded-xl text-slate-500 dark:text-slate-400">
                                    <span className="material-symbols-outlined text-[20px]">quiz</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">Weekly Quiz Review</h4>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">Scheduled</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700 text-slate-400 px-2.5 py-1 rounded-lg">Upcoming</span>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;