import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateAppState, useAppState } from "../localStore";

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const appState = useAppState();
  const [selectedStyle, setSelectedStyle] = useState(appState.onboarding.learningStyle);
  const [weeklyCommitment, setWeeklyCommitment] = useState(appState.onboarding.weeklyCommitment);
  const [intensity, setIntensity] = useState(appState.onboarding.goalIntensity);

  const saveOnboarding = () => {
    updateAppState((state) => ({
      ...state,
      onboarding: {
        completed: true,
        learningStyle: selectedStyle,
        weeklyCommitment,
        goalIntensity: intensity,
        completedAt: new Date().toISOString(),
      },
      settings: {
        ...state.settings,
        learningStyle: selectedStyle,
      },
    }));
    navigate("/dashboard");
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-600 dark:text-slate-300 min-h-screen flex flex-col antialiased">
      <nav className="w-full px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[24px]">
              school
            </span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Elevana
          </span>
        </div>
        <button
          className="text-sm font-semibold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors"
          onClick={() => navigate("/dashboard")}
        >
          Save & Exit
        </button>
      </nav>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 translate-y-1/3"></div>

        <div className="w-full max-w-4xl bg-surface-light dark:bg-surface-dark rounded-2xl shadow-premium overflow-hidden relative backdrop-blur-sm border border-slate-100 dark:border-slate-800 z-10">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-800">
            <div className="h-full bg-gradient-to-r from-primary to-accent w-1/2 shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
          </div>

          <div className="p-8 sm:p-12 lg:p-14">
            <div className="mb-10 text-center sm:text-left">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-indigo-50 dark:bg-indigo-900/30 text-primary dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-800/50">
                  Step 1 of 2
                </span>
                <span className="text-sm font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  Learning Profile
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                How do you learn best?
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                Help Elevana tailor your study materials by selecting your
                preferred learning style. We'll adapt lecture notes to match
                your cognitive patterns.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
              {[
                {
                  id: "visual",
                  icon: "visibility",
                  title: "Visual",
                  desc: "I process information through charts, diagrams, and color-coded notes.",
                },
                {
                  id: "auditory",
                  icon: "headphones",
                  title: "Auditory",
                  desc: "I retain more by listening to lecture recordings, discussions, and podcasts.",
                },
                {
                  id: "reading",
                  icon: "menu_book",
                  title: "Reading/Writing",
                  desc: "I learn best by reading comprehensive texts and writing detailed summaries.",
                },
                {
                  id: "kinesthetic",
                  icon: "science",
                  title: "Kinesthetic",
                  desc: "I need practical examples, interactive quizzes, and hands-on problem solving.",
                },
              ].map((style) => (
                <label
                  key={style.id}
                  className="relative group cursor-pointer h-full"
                >
                  <input
                    type="radio"
                    name="learning_style"
                    value={style.id}
                    className="peer sr-only"
                    checked={selectedStyle === style.id}
                    onChange={() => setSelectedStyle(style.id)}
                  />
                  <div className="h-full p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary/40 dark:hover:border-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col gap-4 bg-white dark:bg-slate-800/50 peer-checked:bg-indigo-50/50 dark:peer-checked:bg-indigo-900/20 peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary/20">
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm border ${selectedStyle === style.id ? "bg-primary text-white border-primary" : "bg-slate-50 dark:bg-slate-700 text-slate-400 border-slate-100 dark:border-slate-600"}`}
                      >
                        <span className="material-symbols-outlined text-[28px]">
                          {style.icon}
                        </span>
                      </div>
                      <div
                        className={`transition-opacity text-primary ${selectedStyle === style.id ? "opacity-100" : "opacity-0"}`}
                      >
                        <span className="material-symbols-outlined">
                          check_circle
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">
                        {style.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        {style.desc}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  schedule
                </span>
                Study Goals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="relative">
                  <label htmlFor="weekly-commitment" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Weekly commitment
                  </label>
                  <div className="relative">
                    <select id="weekly-commitment" name="weeklyCommitment" value={weeklyCommitment} onChange={(event) => setWeeklyCommitment(event.target.value)} className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary shadow-sm py-3.5 pl-4 pr-10 appearance-none font-medium transition-shadow hover:bg-white dark:hover:bg-slate-700">
                      <option>1-3 hours / week</option>
                      <option>3-5 hours / week</option>
                      <option>5-10 hours / week</option>
                      <option>10+ hours / week</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
                <div>
                  <label htmlFor="goal-intensity" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                    Goal intensity
                  </label>
                  <div className="flex items-center gap-4 h-[50px]">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Casual
                    </span>
                    <div className="flex-grow relative group">
                      <input
                        id="goal-intensity"
                        name="goalIntensity"
                        type="range"
                        min="1"
                        max="100"
                        value={intensity}
                        onChange={(e) => setIntensity(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary relative z-10"
                      />
                    </div>
                    <span className="text-xs text-primary font-bold uppercase tracking-wider">
                      Intense
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 pt-6 mt-6 border-t border-transparent">
              <button
                onClick={() => navigate(-1)}
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                type="button"
              >
                Back
              </button>
              <div className="flex items-center gap-6 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={saveOnboarding}
                    className="hidden sm:inline-block text-sm font-semibold text-slate-400 hover:text-primary transition-colors"
                  >
                    Skip customization
                  </button>
                <button
                  onClick={saveOnboarding}
                  className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-semibold text-base px-8 py-3.5 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group"
                  type="button"
                >
                  Continue
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage;
