import React from 'react';
import { View, User } from '../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentView: View;
  onChangeView: (view: View) => void;
  user: User;
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, currentView, onChangeView, user, onLogout }) => {
  const navItems = [
    { view: View.DASHBOARD, label: 'Dashboard', icon: 'dashboard' },
    { view: View.LECTURES, label: 'My Lectures', icon: 'library_books' },
    { view: View.SCHEDULE, label: 'Schedule', icon: 'calendar_month' },
    { view: View.QUIZ, label: 'Quizzes', icon: 'quiz' }, // Typically links to a list, using quiz for demo
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className="w-72 bg-surface-light dark:bg-surface-dark border-r border-neutral-200 dark:border-neutral-800 hidden md:flex flex-col z-20">
        <div className="p-8 pb-6">
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => onChangeView(View.LANDING)}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-light to-primary rounded-xl flex items-center justify-center text-white shadow-glow">
              <span className="material-symbols-outlined text-[20px] font-bold">school</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white font-display">Elevana</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-4 space-y-1.5">
            <div className="mb-6">
                <p className="px-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Workspace</p>
                {navItems.map((item) => (
                    <button
                        key={item.view}
                        onClick={() => onChangeView(item.view)}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium transition-all group ${
                            currentView === item.view
                                ? 'bg-indigo-50/80 dark:bg-indigo-900/20 text-primary-light dark:text-indigo-300 shadow-sm border border-indigo-100 dark:border-indigo-900/30'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <span className={`material-symbols-outlined text-[22px] ${
                            currentView === item.view 
                            ? '' 
                            : 'group-hover:text-primary-light dark:group-hover:text-indigo-400 transition-colors'
                        }`}>
                            {item.icon}
                        </span>
                        {item.label}
                    </button>
                ))}
            </div>
            
             <div className="mb-6">
                <p className="px-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">AI Tools</p>
                <button className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white rounded-xl font-medium transition-all group">
                     <span className="material-symbols-outlined text-[22px] group-hover:text-primary-light dark:group-hover:text-indigo-400 transition-colors">auto_awesome</span>
                     AI Tutor
                </button>
            </div>
        </nav>

        <div className="p-5 border-t border-slate-100 dark:border-slate-800/50">
          <button 
            onClick={() => onChangeView(View.SETTINGS)}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium transition-all ${
                currentView === View.SETTINGS
                    ? 'bg-indigo-50/80 dark:bg-indigo-900/20 text-primary-light dark:text-indigo-300'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">settings</span>
            Settings
          </button>
           <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl font-medium transition-all mt-1"
          >
            <span className="material-symbols-outlined text-[22px]">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto bg-background-light dark:bg-background-dark relative">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-surface-light dark:bg-surface-dark border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 sticky top-0 z-30">
            <div className="flex items-center gap-2 font-display text-primary dark:text-white font-bold text-lg">
                <span className="material-symbols-outlined text-accent">school</span>
                Elevana
            </div>
            <button className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <span className="material-symbols-outlined">menu</span>
            </button>
        </div>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;