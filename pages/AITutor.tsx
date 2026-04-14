import React from "react";

const AITutor: React.FC = () => {
  return (
    <div className="flex h-full bg-background-light dark:bg-background-dark">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-x-hidden">
        {/* Header */}
        <header className="h-14 px-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-white/50 dark:bg-background-dark/50 backdrop-blur-sm z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                Current Scope
              </span>
              <div className="flex items-center gap-1.5 cursor-pointer group">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">
                  Biology 101 - Week 2
                </span>
                <span className="material-symbols-outlined text-base text-slate-400 group-hover:text-primary transition-colors">
                  expand_more
                </span>
              </div>
            </div>
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2"></div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-100 dark:border-slate-700/50">
              <span className="material-symbols-outlined text-[14px] text-slate-400">
                schedule
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                Last updated 2 mins ago
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
              <span className="material-symbols-outlined text-[20px]">
                settings
              </span>
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
              <span className="material-symbols-outlined text-[20px]">
                ios_share
              </span>
            </button>
          </div>
        </header>

        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-5 space-y-6">
          <div className="flex justify-center">
            <span className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-0.5 rounded-full">
              TODAY, 10:23 AM
            </span>
          </div>

          {/* User Message */}
          <div className="flex justify-end">
            <div className="max-w-xl bg-[#312E81] text-white rounded-2xl rounded-tr-sm p-3.5 shadow-sm relative group">
              <p className="leading-relaxed text-sm">
                I'm struggling to understand the difference between mitosis and
                meiosis from the lecture slides. Can you break it down simply?
              </p>
              <div className="absolute -right-10 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-7 h-7 rounded-full bg-[#FAFAFA] border border-slate-200 flex items-center justify-center">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                    alt="User"
                    className="w-5 h-5 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Message */}
          <div className="flex justify-start">
            <div className="flex items-end gap-3 max-w-3xl">
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mb-4 shadow-md shadow-indigo-600/20">
                <span className="material-symbols-outlined text-base">
                  smart_toy
                </span>
              </div>
              <div className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-2xl rounded-tl-sm p-5 shadow-sm">
                <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
                  <p className="mb-3">
                    Sure! Based on the{" "}
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-1 py-0.5 rounded cursor-pointer hover:underline text-xs">
                      Week 2 Lecture Slides
                    </span>{" "}
                    and the textbook chapter on Cell Division, here is the core
                    difference:
                  </p>

                  <p className="mb-2">
                    <strong className="text-slate-900 dark:text-white">
                      Mitosis
                    </strong>{" "}
                    is for growth and repair. It produces two identical cells.{" "}
                    <span className="text-[10px] text-slate-400 font-medium">
                      [Source: p.15]
                    </span>
                  </p>
                  <p className="mb-4">
                    <strong className="text-slate-900 dark:text-white">
                      Meiosis
                    </strong>{" "}
                    is for reproduction. It produces four genetically unique
                    cells with half the number of chromosomes.{" "}
                    <span className="text-[10px] text-slate-400 font-medium">
                      [Source: p.18]
                    </span>
                  </p>

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-indigo-500">
                        lightbulb
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Key Comparison
                      </span>
                    </div>
                    <div className="p-0.5">
                      <table className="w-full text-xs text-left">
                        <thead className="text-[10px] text-slate-500 font-bold uppercase bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700/50">
                          <tr>
                            <th className="px-3 py-2">Feature</th>
                            <th className="px-3 py-2 text-slate-700 dark:text-slate-300">
                              Mitosis
                            </th>
                            <th className="px-3 py-2 text-slate-700 dark:text-slate-300">
                              Meiosis
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 bg-white dark:bg-slate-900">
                          <tr>
                            <td className="px-3 py-2 font-medium text-slate-900 dark:text-white">
                              Purpose
                            </td>
                            <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                              Growth & Repair
                            </td>
                            <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                              Reproduction
                            </td>
                          </tr>
                          <tr>
                            <td className="px-3 py-2 font-medium text-slate-900 dark:text-white">
                              Result
                            </td>
                            <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                              2 Identical Cells
                            </td>
                            <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                              4 Unique Cells
                            </td>
                          </tr>
                          <tr>
                            <td className="px-3 py-2 font-medium text-slate-900 dark:text-white">
                              Chromosomes
                            </td>
                            <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                              Same (Diploid)
                            </td>
                            <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                              Half (Haploid)
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Actions & Input */}
        <div className="p-4 pt-2 bg-gradient-to-t from-white via-white to-transparent dark:from-background-dark dark:via-background-dark pb-6">
          <div className="max-w-4xl mx-auto space-y-3">
            <style>{`
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {[
                { icon: "summarize", label: "Summarize" },
                { icon: "quiz", label: "Generate Quiz" },
                { icon: "school", label: "Create Study Guide" },
                { icon: "check_circle", label: "Check Understanding" },
              ].map((action) => (
                <button
                  key={action.label}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/30 shadow-sm hover:shadow-md hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {action.icon}
                  </span>
                  {action.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <button className="p-1.5 text-primary bg-indigo-50 dark:bg-indigo-900/20 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">
                    add
                  </span>
                </button>
              </div>
              <input
                type="text"
                placeholder="Ask a question about your lecture notes..."
                className="w-full pl-10 pr-20 py-3 text-sm bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 dark:text-white placeholder:text-slate-400"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">
                    mic
                  </span>
                </button>
                <button className="p-1.5 bg-primary text-white rounded-lg shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">
                    send
                  </span>
                </button>
              </div>
            </div>

            <div className="flex justify-center items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 select-none">
              <span className="material-symbols-outlined text-[12px]">
                lock
              </span>
              <span>
                Elevana AI answers are generated securely from your uploaded
                content. Your data remains private.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Source Documents */}
      <aside className="w-72 border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-background-dark hidden lg:flex flex-col">
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-base text-slate-800 dark:text-white">
              Source Documents
            </h2>
            <span className="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[9px] font-bold uppercase tracking-wider rounded-full border border-indigo-100 dark:border-indigo-900/30">
              3 Active
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700/50">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                Context Coverage
              </span>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                85%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full w-[85%]"></div>
            </div>
            <p className="text-[9px] text-slate-400 mt-1.5 text-center">
              AI is currently analyzing selected files
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <div className="space-y-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Lecture Materials
            </div>

            {/* Document Item 1 */}
            <div className="group p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/10 hover:shadow-sm hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-pointer relative">
              <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0 text-red-500">
                  <span className="material-symbols-outlined text-[18px]">
                    picture_as_pdf
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    Week 2 - Cell Division....
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    2.4 MB • Added Yesterday
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                      Indexed
                    </span>
                    <span className="material-symbols-outlined text-[12px] text-emerald-500">
                      check_circle
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Item 2 */}
            <div className="group p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-dark hover:shadow-sm hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all cursor-pointer relative">
              <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 text-blue-500">
                  <span className="material-symbols-outlined text-[18px]">
                    description
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    Notes_Mitosis.docx
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    156 KB • Added Today
                  </p>
                  <div className="mt-1.5">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400">
                        Indexing 75%...
                      </span>
                    </div>
                    <div className="w-20 bg-blue-100 dark:bg-blue-900/30 rounded-full h-0.5 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full w-[75%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Item 3 */}
            <div className="group p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-dark hover:shadow-sm hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all cursor-pointer relative">
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0 text-purple-500">
                  <span className="material-symbols-outlined text-[18px]">
                    mic
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    Lecture_Rec_02.mp3
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    45 min • Added 2d ago
                  </p>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-0.5 mt-1.5 mb-1 overflow-hidden">
                    <div className="bg-purple-500 h-full w-3/4 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[10px] text-purple-600">
                      check_circle
                    </span>
                    <span className="text-[9px] font-bold text-purple-600">
                      Transcribed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Related Topics
            </div>
            <div className="space-y-1">
              {[
                "Cell Cycle Regulation",
                "Genetic Variation",
                "DNA Replication",
              ].map((topic) => (
                <div
                  key={topic}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group transition-colors"
                >
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">
                    {topic}
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-slate-300 group-hover:text-primary transition-colors">
                    chevron_right
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full py-2.5 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-center gap-2 text-slate-500 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-400 transition-all">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Upload Material
          </button>
        </div>

        {/* Bottom Tip */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-background-dark">
          <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-xl p-3">
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0 text-orange-500 ring-4 ring-orange-50 dark:ring-orange-900/10">
                <span className="material-symbols-outlined text-[16px]">
                  lightbulb
                </span>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-0.5">
                  Study Tip
                </h4>
                <p className="text-[10px] leading-relaxed text-slate-600 dark:text-slate-400">
                  Uploading your syllabus can help the AI prioritize important
                  topics for your upcoming midterm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default AITutor;
