import React from 'react';

interface QuizProps {
  onExit: () => void;
}

const Quiz: React.FC<QuizProps> = ({ onExit }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none z-0 opacity-30 bg-[radial-gradient(at_40%_20%,hsla(228,100%,74%,0.1)_0px,transparent_50%),radial-gradient(at_80%_0%,hsla(189,100%,56%,0.1)_0px,transparent_50%),radial-gradient(at_0%_50%,hsla(340,100%,76%,0.1)_0px,transparent_50%)]"></div>
        
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-4 flex items-center justify-between">
                <div className="flex items-center gap-5">
                     <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="material-symbols-outlined text-white text-lg">school</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white font-display">Elevana</span>
                    </div>
                    <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                    <div className="hidden sm:flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Current Quiz</span>
                        <h1 className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[200px] lg:max-w-xs">
                            Mid-term Review: Biology 101
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
                        <span className="material-symbols-outlined text-lg text-primary-light dark:text-accent">timer</span>
                        <span className="tabular-nums font-semibold">14:32</span>
                    </div>
                    <button onClick={onExit} className="text-sm font-medium text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 transition-colors px-2">
                        Exit
                    </button>
                </div>
            </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl relative z-10">
             <div className="mb-12">
                <div className="flex justify-between items-end mb-3 px-1">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-primary-light dark:text-accent uppercase tracking-widest mb-1">Question 4</span>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white leading-none">Cellular Biology</span>
                    </div>
                    <span className="text-sm font-medium text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">4 <span className="text-slate-300 mx-1">/</span> 10</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: '40%' }}></div>
                </div>
            </div>

            <section className="bg-white dark:bg-slate-800 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-700/50 p-8 md:p-12 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-900/10 rounded-bl-full pointer-events-none"></div>
                <div className="mb-10 relative">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-primary dark:text-indigo-300 text-xs font-bold uppercase tracking-wide mb-4 border border-indigo-100 dark:border-indigo-800">
                        <span className="material-symbols-outlined text-sm">category</span>
                        Topic: Metabolism
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-snug tracking-tight font-display">
                        Which cellular organelle is responsible for generating the majority of the cell's supply of adenosine triphosphate (ATP)?
                    </h2>
                </div>

                <div className="space-y-4">
                     {[
                        { id: '1', text: 'Nucleus' },
                        { id: '2', text: 'Mitochondria', checked: true },
                        { id: '3', text: 'Golgi Apparatus' },
                        { id: '4', text: 'Endoplasmic Reticulum' }
                     ].map((option) => (
                        <label key={option.id} className="relative group cursor-pointer block">
                            <input type="radio" name="quiz-option" className="peer sr-only" defaultChecked={option.checked} />
                            <div className="flex items-center p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary-light/30 dark:hover:border-accent/30 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all duration-200 bg-white dark:bg-slate-800 peer-checked:border-primary-light peer-checked:bg-indigo-50/50 dark:peer-checked:bg-indigo-900/20 dark:peer-checked:border-accent">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 mr-5 flex items-center justify-center transition-all duration-200 peer-checked:bg-primary-light peer-checked:border-primary-light dark:peer-checked:bg-accent dark:peer-checked:border-accent group-hover:border-primary-light dark:group-hover:border-accent">
                                    <span className="material-symbols-outlined text-[16px] text-white opacity-0 peer-checked:opacity-100">check</span>
                                </div>
                                <span className="text-lg font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{option.text}</span>
                            </div>
                        </label>
                     ))}
                </div>

                 <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-100 dark:border-slate-700/50">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-all">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Previous
                    </button>
                    <button className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-light text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                        Next Question
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                </div>
            </section>
        </main>
    </div>
  );
};

export default Quiz;