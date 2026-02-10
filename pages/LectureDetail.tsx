import React from 'react';

interface LectureDetailProps {
  onBack: () => void;
}

const LectureDetail: React.FC<LectureDetailProps> = ({ onBack }) => {
  return (
    <div className="flex h-full">
         <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark relative scroll-smooth p-8">
            <div className="max-w-4xl mx-auto">
                <button onClick={onBack} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-8 transition-colors group">
                    <span className="material-symbols-outlined text-[18px] mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    Back to My Lectures
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-primary-dark dark:text-indigo-300 text-[11px] font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-800/50 shadow-sm">Transcript • 96% Accuracy</span>
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">schedule</span> 1 hr 15 min read
                    </span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white tracking-tight mb-6 leading-[1.15]">
                    Supply and Demand Dynamics
                </h1>
                <p className="text-xl text-slate-500 dark:text-slate-400 font-light leading-relaxed max-w-2xl mb-12">
                    Understanding how market forces interact to determine price and quantity in a competitive environment.
                </p>

                <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-surface-dark border border-indigo-100 dark:border-indigo-900/30 shadow-card mb-16 transition-all hover:shadow-lg hover:shadow-indigo-900/5">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500">
                        <span className="material-symbols-outlined text-9xl text-primary">lightbulb</span>
                    </div>
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-primary-light"></div>
                    <div className="p-8 relative z-10">
                        <h3 className="text-primary-dark dark:text-indigo-200 font-bold text-lg mb-6 flex items-center gap-2.5">
                            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg">
                                <span className="material-symbols-outlined text-primary text-[20px]">auto_awesome</span>
                            </div>
                            Key Takeaways
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4">
                                <span className="h-2 w-2 rounded-full bg-indigo-400 mt-2.5 flex-none shadow-[0_0_8px_rgba(129,140,248,0.6)]"></span>
                                <span className="text-slate-700 dark:text-slate-300 text-[1.05rem] leading-relaxed"><strong>Price and quantity</strong> are inversely related in demand but directly related in supply curves.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="h-2 w-2 rounded-full bg-indigo-400 mt-2.5 flex-none shadow-[0_0_8px_rgba(129,140,248,0.6)]"></span>
                                <span className="text-slate-700 dark:text-slate-300 text-[1.05rem] leading-relaxed"><strong>Market Equilibrium</strong> occurs where the supply and demand curves intersect, effectively clearing the market.</span>
                            </li>
                             <li className="flex items-start gap-4">
                                <span className="h-2 w-2 rounded-full bg-indigo-400 mt-2.5 flex-none shadow-[0_0_8px_rgba(129,140,248,0.6)]"></span>
                                <span className="text-slate-700 dark:text-slate-300 text-[1.05rem] leading-relaxed">External factors shift the curves themselves, creating a new equilibrium point (e.g., technology improvements shift supply right).</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <article className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]">
                        Economics is fundamentally the study of how society manages its scarce resources. In most societies, resources are allocated not by an all-powerful dictator but through the combined actions of millions of households and firms. Economists therefore begin their study by considering how households and firms make decisions.
                    </p>
                    <h2 className="text-2xl font-serif font-bold mt-10 mb-4">The Law of Demand</h2>
                    <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                        The law of demand states that, other things being equal, the quantity demanded of a good falls when the price of the good rises. This relationship between price and quantity demanded is true for most goods in the economy and is, in fact, so pervasive that economists call it the <strong>law of demand</strong>.
                    </p>
                     <div className="my-10 p-1 rounded-2xl bg-gradient-to-r from-indigo-100 via-white to-white dark:from-indigo-900 dark:via-surface-dark dark:to-surface-dark shadow-sm">
                        <div className="bg-white dark:bg-[#151b2b] rounded-xl p-6 pl-8 border-l-4 border-primary relative overflow-hidden">
                            <span className="absolute right-4 top-4 text-6xl text-slate-50 dark:text-slate-800 font-serif select-none pointer-events-none">"</span>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-base flex items-center gap-2 uppercase tracking-wider text-[11px] text-primary">
                                <span className="material-symbols-outlined text-[16px]">school</span> Professor's Note
                            </h4>
                            <p className="text-[1.05rem] text-slate-600 dark:text-slate-300 italic mb-0 !leading-relaxed font-serif relative z-10">
                                Remember the distinction between a 'movement along the curve' vs a 'shift of the curve'. Price changes cause movement along. External factors (income, tastes, expectations) cause shifts.
                            </p>
                        </div>
                    </div>
                </article>
            </div>
         </main>
          <aside className="w-[72px] hidden xl:flex flex-col items-center py-8 border-l border-slate-200/60 dark:border-slate-800/60 bg-surface-light dark:bg-surface-dark z-20">
            <button className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center mb-8 hover:bg-primary-dark transition-all shadow-lg shadow-indigo-500/30 group" title="Ask AI Assistant">
                <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">auto_awesome</span>
            </button>
            <div className="flex-1 w-px bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-700 dark:to-transparent my-2"></div>
            <div className="flex flex-col gap-6 mt-8">
                <button className="w-10 h-10 rounded-lg text-slate-400 hover:text-primary hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center justify-center transition-all" title="Bookmarks">
                    <span className="material-symbols-outlined text-[22px]">bookmark_border</span>
                </button>
                <button className="w-10 h-10 rounded-lg text-slate-400 hover:text-primary hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center justify-center transition-all" title="Highlights">
                    <span className="material-symbols-outlined text-[22px]">border_color</span>
                </button>
                <button className="w-10 h-10 rounded-lg text-slate-400 hover:text-primary hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center justify-center transition-all" title="Share Note">
                    <span className="material-symbols-outlined text-[22px]">ios_share</span>
                </button>
            </div>
        </aside>
    </div>
  );
};

export default LectureDetail;