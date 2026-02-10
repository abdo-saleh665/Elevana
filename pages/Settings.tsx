import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8 pb-32">
        <header className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-serif">Settings</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage your account preferences and subscription</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="hidden lg:block lg:col-span-3">
                <div className="sticky top-32 space-y-1">
                    <p className="px-4 pb-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Menu</p>
                    {['Profile', 'App Preferences', 'Subscription', 'Security'].map((item, idx) => (
                        <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${idx === 0 ? 'bg-white dark:bg-slate-800 text-primary dark:text-indigo-300 font-semibold shadow-sm border border-slate-100 dark:border-slate-700' : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/50 hover:text-primary'}`}>
                             <span className="material-symbols-outlined text-lg">{['person', 'tune', 'card_membership', 'security'][idx]}</span>
                             {item}
                        </a>
                    ))}
                </div>
            </div>

            <div className="lg:col-span-9 space-y-8">
                {/* Profile Section */}
                <section id="profile" className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-slate-200/60 dark:border-slate-700 p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-700/50 pb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">Profile Information</h2>
                            <p className="text-sm text-slate-500 mt-1">Update your photo and personal details.</p>
                        </div>
                        <button className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30">Edit Profile</button>
                    </div>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="relative group cursor-pointer self-center md:self-start">
                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZqSawxwi_h7F6flOxmbBCroI532FWbizjtaDoRSuq6n5n18oiILC57PlKOHqK9xi5j8D7nuy78ikwDX3fefySAeJ_VF-4_T_087ZYOEScKpg_6tnkBE54kuGkwdOuh_5W4hBcE-TMTjgWK7FI7_ThW3Tvl0Y7DYvPfxkWjeu1iWAnMDJS2aOHNCDesuEGWOAM1qb3aunHHHJwFcEz7-FxjgmZp5ctcQtEV31-uarWE3i5pHKXSyHYkOVkRqKc4B-G1KuW7AvqZWw" alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-slate-800 ring-2 ring-indigo-100 dark:ring-indigo-900" />
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity m-1">
                                <span className="material-symbols-outlined text-white">camera_alt</span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-6 w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
                                    <input type="text" defaultValue="Alex Student" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary block p-3 transition-shadow shadow-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
                                    <input type="email" defaultValue="alex.student@university.edu" disabled className="w-full bg-slate-100/50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm font-medium rounded-xl block p-3 cursor-not-allowed" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Subscription Section */}
                <section id="subscription" className="bg-gradient-to-br from-white to-indigo-50/30 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl border border-indigo-100 dark:border-slate-700 p-8 shadow-sm relative overflow-hidden group">
                     <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors duration-700"></div>
                     <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 relative z-10 font-display">Subscription</h2>
                     <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-600/50 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 shadow-sm">
                        <div className="flex items-center gap-5 w-full md:w-auto">
                            <div className="w-14 h-14 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-primary dark:text-indigo-300 flex items-center justify-center flex-shrink-0 ring-4 ring-indigo-50/50 dark:ring-indigo-900/10">
                                <span className="material-symbols-outlined text-2xl">starter_data</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Scholar Pro</h3>
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 uppercase tracking-wide border border-indigo-200 dark:border-indigo-800">Active</span>
                                </div>
                                <p className="text-xs font-medium text-slate-500 mt-1">Next billing date: Nov 24, 2023</p>
                            </div>
                        </div>
                        <button className="w-full md:w-auto bg-white dark:bg-surface-dark hover:bg-slate-50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-semibold py-3 px-6 rounded-xl shadow-sm transition-all text-sm">Manage Plan</button>
                     </div>
                </section>
            </div>
        </div>
    </div>
  );
};

export default Settings;