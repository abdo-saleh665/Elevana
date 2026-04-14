import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LectureDetail: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const contentItems = [
    { title: "Introduction", id: "introduction" },
    { title: "The Law of Demand", id: "law-of-demand" },
    {
      title: "Market Equilibrium",
      id: "market-equilibrium",
      subItems: ["Equilibrium Shifts", "Surplus & Shortage"],
    },
    { title: "Elasticity", id: "elasticity" },
    { title: "Summary", id: "summary" },
  ];

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-background-dark overflow-hidden font-sans text-slate-900 dark:text-slate-100">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark flex items-center justify-between px-6 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/lectures")}
            className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              arrow_back
            </span>
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span className="text-primary hover:underline cursor-pointer">
                ECON 101
              </span>
              <span className="material-symbols-outlined text-[10px]">
                chevron_right
              </span>
              <span>Fall Semester</span>
            </div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
              Lecture 4: Supply & Demand Dynamics
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group hidden sm:block">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-slate-400 group-focus-within:text-primary transition-colors">
              search
            </span>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 w-64 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 placeholder-slate-400 transition-all outline-none"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Contents */}
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-surface-dark/50 hidden lg:flex flex-col py-8 pl-8 pr-4 overflow-y-auto shrink-0">

          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6 px-2">
            Contents
          </h3>

          <nav className="flex flex-col space-y-1 relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700 ml-2"></div>
            {contentItems.map((item, index) => (
              <div key={item.id} className="relative group">
                <a
                  href={`#${item.id}`}
                  className={`block py-1.5 pl-6 pr-3 text-sm transition-colors border-l-2 -ml-[1px] ${
                    index === 0
                      ? "border-primary text-primary font-bold bg-indigo-50/50 dark:bg-indigo-900/10 rounded-r-lg"
                      : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {index + 1 < 10 ? `0${index + 1}` : index + 1} &nbsp;{" "}
                  {item.title}
                </a>
                {item.subItems && (
                  <div className="ml-6 mt-1 mb-2 space-y-1 pl-4 border-l border-slate-100 dark:border-slate-800">
                    {item.subItems.map((sub, i) => (
                      <a
                        key={i}
                        href="#"
                        className="block py-1 text-xs text-slate-400 hover:text-primary transition-colors"
                      >
                        {index + 1}.{i + 1} &nbsp; {sub}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto scroll-smooth relative px-6 md:px-12 py-10 md:py-14 bg-white dark:bg-background-dark">
          <article className="max-w-3xl mx-auto pb-24">
            {/* Header Area */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-primary dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-800/50">
                  TRANSCRIPT • 96% ACCURACY
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <span className="material-symbols-outlined text-[14px]">
                    schedule
                  </span>
                  1hr 15 min read
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-lg shadow-indigo-500/20 transition-all font-semibold text-xs uppercase tracking-wide">
                  <span className="material-symbols-outlined text-[18px]">
                    quiz
                  </span>
                  Take Quiz
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg transition-all font-semibold text-xs uppercase tracking-wide">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    auto_awesome
                  </span>
                  Ask AI
                </button>
                <button className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                  <span className="material-symbols-outlined text-[20px]">
                    download
                  </span>
                </button>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white tracking-tight mb-6 leading-[1.1]">
              Supply and Demand Dynamics
            </h1>

            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-light leading-relaxed mb-12 max-w-2xl">
              Understanding how market forces interact to determine price and
              quantity in a competitive environment.
            </p>

            {/* Key Takeaways Box */}
            <div className="relative group overflow-hidden rounded-2xl bg-white dark:bg-surface-dark border border-indigo-100 dark:border-indigo-900/30 shadow-card hover:shadow-lg hover:shadow-indigo-900/5 transition-all mb-16">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none">
                <span className="material-symbols-outlined text-9xl text-primary">
                  lightbulb
                </span>
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary-light"></div>

              <div className="p-8 md:p-10 relative z-10">
                <div className="flex items-center gap-3 mb-6 text-primary-dark dark:text-indigo-200 font-bold text-lg">
                  <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">
                      auto_awesome
                    </span>
                  </div>
                  Key Takeaways
                </div>

                <ul className="space-y-4">
                  {[
                    {
                      bold: "Price and quantity",
                      text: "are inversely related in demand but directly related in supply curves.",
                    },
                    {
                      bold: "Market Equilibrium",
                      text: "occurs where the supply and demand curves intersect, effectively clearing the market.",
                    },
                    {
                      bold: "External factors",
                      text: "shift the curves themselves, creating a new equilibrium point (e.g., technology improvements shift supply right).",
                    },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-2.5 flex-none box-content border-[3px] border-indigo-100 dark:border-indigo-900/30"></span>
                      <span className="text-slate-700 dark:text-slate-300 text-[1.05rem] leading-relaxed">
                        <strong className="font-bold text-slate-900 dark:text-white">
                          {item.bold}
                        </strong>{" "}
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Content Body */}
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none font-serif md:prose-xl">
              <p className="first-letter:text-6xl first-letter:font-bold first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:leading-[0.8] text-slate-600 dark:text-slate-300">
                conomics is fundamentally the study of how society manages its
                scarce resources. In most societies, resources are allocated not
                by an all-powerful dictator but through the combined actions of
                millions of households and firms. Economists therefore begin
                their study by considering how households and firms make
                decisions.
              </p>

              <h3
                id="law-of-demand"
                className="mt-12 font-bold mb-4 text-slate-900 dark:text-white"
              >
                The Law of Demand
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[1.125rem]">
                The law of demand states that, other things being equal, the
                quantity demanded of a good falls when the price of the good
                rises. This relationship between price and quantity demanded is
                true for most goods in the economy and is, in fact, so pervasive
                that economists call it the{" "}
                <strong className="font-bold text-primary dark:text-indigo-300">
                  law of demand
                </strong>
                .
              </p>

              {/* Interactive Visualization Placeholder */}
              <div className="my-14 relative group cursor-pointer transition-transform hover:scale-[1.01] duration-300">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                <div className="relative rounded-xl bg-slate-50 dark:bg-[#151b2b] p-1 border border-indigo-100 dark:border-indigo-900/30 overflow-hidden">
                  <div className="h-64 md:h-80 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-slate-100 dark:bg-slate-800/50 rounded-lg flex flex-col items-center justify-center relative shadow-inner">
                    <div className="absolute inset-0 bg-white/50 dark:bg-black/20"></div>
                    <div className="relative w-16 h-16 bg-white dark:bg-surface-dark rounded-full shadow-lg flex items-center justify-center text-primary mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 z-10">
                      <span className="material-symbols-outlined text-[32px]">
                        show_chart
                      </span>
                    </div>
                    <h4 className="relative text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 z-10">
                      Interactive Visualization
                    </h4>
                    <p className="relative text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium z-10">
                      Click to expand
                    </p>
                    <div className="bottom-4 text-[10px] uppercase font-bold text-slate-300 absolute w-full text-center tracking-widest z-10">
                      • Fig 1.1: The Downward Sloping Demand Curve •
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[1.125rem]">
                Consider the market for ice cream. If the price of ice cream
                rose to $20 per scoop, you would buy less ice cream. You might
                buy frozen yogurt instead. If the price of ice cream fell to
                $0.20 per scoop, you would buy more.
              </p>

              <h3
                id="market-equilibrium"
                className="mt-12 font-bold mb-4 text-slate-900 dark:text-white"
              >
                Market Equilibrium
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[1.125rem]">
                At the equilibrium price, the quantity of the good that buyers
                are willing and able to buy exactly balances the quantity that
                sellers are willing and able to sell. The equilibrium price is
                sometimes called the{" "}
                <strong className="font-bold text-primary dark:text-indigo-300">
                  market-clearing price
                </strong>{" "}
                because, at this price, everyone in the market has been
                satisfied:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                <li className="pl-2">
                  Buyers have bought all they want to buy.
                </li>
                <li className="pl-2">
                  Sellers have sold all they want to sell.
                </li>
              </ul>

              {/* Professor's Note */}
              <div className="my-12 relative pl-8">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                <div className="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-r-xl p-6 border border-indigo-100/50 dark:border-indigo-800/30">
                  <h4 className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-3">
                    <span className="material-symbols-outlined text-[18px]">
                      school
                    </span>
                    Professor's Note
                  </h4>
                  <p className="font-serif italic text-slate-700 dark:text-slate-300 text-lg leading-relaxed relative">
                    <span className="absolute -left-2 -top-2 text-4xl text-indigo-200 dark:text-indigo-900 font-serif select-none">
                      “
                    </span>
                    Remember the distinction between a 'movement along the
                    curve' vs a 'shift of the curve'. Price changes cause
                    movement along. External factors (income, tastes,
                    expectations) cause shifts.
                  </p>
                </div>
              </div>

              <h3
                id="elasticity"
                className="mt-12 font-bold mb-4 text-slate-900 dark:text-white"
              >
                Elasticity
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[1.125rem] mb-8">
                To measure how much demand responds to changes in its
                determinants, economists use the concept of elasticity.{" "}
                <strong className="font-bold text-primary dark:text-indigo-300">
                  Price elasticity of demand
                </strong>{" "}
                measures how much the quantity demanded responds to a change in
                price.
              </p>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[1.125rem]">
                Demand for a good is said to be elastic if the quantity demanded
                responds substantially to changes in the price. Demand is said
                to be inelastic if the quantity demanded responds only slightly
                to changes in the price.
              </p>
            </div>

            {/* Feedback footer */}
            <div className="mt-20 pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500">
              <span>Was this helpful?</span>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <span className="material-symbols-outlined text-[18px]">
                    thumb_up
                  </span>
                </button>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <span className="material-symbols-outlined text-[18px]">
                    thumb_down
                  </span>
                </button>
              </div>
            </div>
          </article>
        </main>

        {/* Right Sidebar - Tools */}
        <aside className="w-[72px] hidden xl:flex flex-col items-center py-8 border-l border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-surface-dark z-20 shrink-0">

          <div className="flex-1 w-px bg-gradient-to-b from-slate-100 via-slate-200 to-transparent dark:from-slate-800 dark:via-slate-700 dark:to-transparent my-2"></div>

          <div className="flex flex-col gap-8 mt-8 pb-8">
            <button
              className="group relative w-10 h-10 rounded-xl text-slate-400 hover:text-primary hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center justify-center transition-all"
              title="Bookmarks"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                bookmark_border
              </span>
            </button>
            <button
              className="group relative w-10 h-10 rounded-xl text-slate-400 hover:text-primary hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center justify-center transition-all"
              title="Highlights"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                border_color
              </span>
            </button>
            <button
              className="group relative w-10 h-10 rounded-xl text-slate-400 hover:text-primary hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center justify-center transition-all"
              title="Share Note"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                ios_share
              </span>
            </button>
          </div>
        </aside>
      </div>

      {/* Floating Focus Mode Banner */}
      <div className="fixed bottom-6 left-6 z-50">
        <div className="bg-white dark:bg-surface-dark border border-indigo-100 dark:border-indigo-900/30 rounded-2xl shadow-premium p-4 flex items-center gap-4 max-w-xs animate-slide-up-fade">
        </div>
      </div>
    </div>
  );
};

export default LectureDetail;
