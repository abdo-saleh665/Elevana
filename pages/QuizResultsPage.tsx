import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  formatElapsedTime,
  getLatestQuizAttempt,
  getQuizAttempt,
  type QuizAttempt,
} from "../quizAttempts";

const getResultCopy = (score: number) => {
  if (score >= 80) {
    return {
      label: "Passed",
      title: "Great job, Alex!",
      tone: "emerald",
      body: "You've shown a strong understanding of this quiz. Review the missed or skipped questions to aim for a perfect score next time.",
    };
  }

  if (score >= 60) {
    return {
      label: "Passed",
      title: "Good progress, Alex.",
      tone: "amber",
      body: "You passed, but a few concepts still need attention. Review the explanations below before retaking the quiz.",
    };
  }

  return {
    label: "Needs Review",
    title: "Keep practicing, Alex.",
    tone: "rose",
    body: "This attempt shows gaps in the topic. Review the explanations below, then retake the quiz when ready.",
  };
};

const QuizResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { attemptId } = useParams();
  const state = location.state as QuizAttempt | null;
  const attempt = state?.id
    ? state
    : getQuizAttempt(attemptId) || (!attemptId ? getLatestQuizAttempt() : null);

  // Handle direct access or missing state
  if (!attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-500">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">No Results Found</h2>
          <button
            onClick={() => navigate("/quiz")}
            className="text-primary hover:underline"
          >
            Return to Quiz Library
          </button>
        </div>
      </div>
    );
  }

  const { questions, answers, score, correct, wrong, skipped, elapsedSeconds } =
    attempt;
  const timeTaken = formatElapsedTime(elapsedSeconds);
  const resultCopy = getResultCopy(score);

  const handleExit = () => {
    navigate("/quiz");
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 overflow-y-auto min-h-screen bg-background-light dark:bg-background-dark flex flex-col relative">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30 bg-[radial-gradient(at_40%_20%,hsla(228,100%,74%,0.1)_0px,transparent_50%),radial-gradient(at_80%_0%,hsla(189,100%,56%,0.1)_0px,transparent_50%),radial-gradient(at_0%_50%,hsla(340,100%,76%,0.1)_0px,transparent_50%)]"></div>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl relative z-10 flex flex-col items-center">
        <div className="text-center mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Quiz Results
          </span>
          <div className="h-px w-24 bg-slate-200 mx-auto mt-2"></div>
        </div>

        {/* Score Card */}
        <div className="w-full bg-white dark:bg-surface-dark rounded-3xl shadow-premium border border-neutral-100 dark:border-neutral-800/50 p-8 md:p-10 mb-8 mt-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-primary to-rose-400"></div>

          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Score Circle */}
            <div className="relative w-40 h-40 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                  className="dark:stroke-slate-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * score) / 100}
                  className="text-primary transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-neutral-800 dark:text-white">
                  {score}%
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Final Score
                </span>
              </div>
            </div>

            <div className="flex-grow text-center md:text-left">
              <span
                className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-3 uppercase tracking-wide ${
                  resultCopy.tone === "emerald"
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                    : resultCopy.tone === "amber"
                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                      : "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                }`}
              >
                {resultCopy.label}
              </span>
              <h2 className="text-3xl font-bold text-neutral-800 dark:text-white mb-2">
                {resultCopy.title}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 max-w-md">
                {resultCopy.body}
              </p>

              <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                <div className="flex flex-col items-center justify-center w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                  <span className="material-symbols-outlined text-emerald-500 mb-1">
                    check_circle
                  </span>
                  <span className="text-lg font-bold text-neutral-800 dark:text-white leading-none">
                    {correct}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase mt-1">
                    Correct
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                  <span className="material-symbols-outlined text-rose-500 mb-1">
                    cancel
                  </span>
                  <span className="text-lg font-bold text-neutral-800 dark:text-white leading-none">
                    {wrong}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase mt-1">
                    Wrong
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                  <span className="material-symbols-outlined text-amber-500 mb-1">
                    pending
                  </span>
                  <span className="text-lg font-bold text-neutral-800 dark:text-white leading-none">
                    {skipped}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase mt-1">
                    Skipped
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                  <span className="material-symbols-outlined text-primary mb-1">
                    timer
                  </span>
                  <span className="text-lg font-bold text-neutral-800 dark:text-white leading-none">
                    {timeTaken}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase mt-1">
                    Time
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="w-full space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">
              analytics
            </span>
            <h3 className="text-lg font-bold text-neutral-800 dark:text-white">
              Detailed Analysis
            </h3>
          </div>

          {questions.map((q, index) => {
            const isCorrect = answers[q.id] === q.correctOptionId;
            const userAnswerText =
              q.options.find((o) => o.id === answers[q.id])?.text || "Skipped";

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isCorrect ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-neutral-800 dark:text-white mb-3">
                      {q.text}
                    </h4>

                    {/* Answers Display */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      {!isCorrect && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 rounded-lg text-sm border border-rose-100 dark:border-rose-800">
                          <span className="material-symbols-outlined text-sm">
                            close
                          </span>
                          <span className="font-medium">
                            Your: {userAnswerText}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm border border-emerald-100 dark:border-emerald-800">
                        <span className="material-symbols-outlined text-sm">
                          check
                        </span>
                        <span className="font-medium">
                          Correct:{" "}
                          {
                            q.options.find((o) => o.id === q.correctOptionId)
                              ?.text
                          }
                        </span>
                      </div>
                    </div>

                    {/* AI Insight */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border-l-4 border-primary/60">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-primary text-sm">
                          auto_awesome
                        </span>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                          Elevana AI Insight
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 mb-8">
          <button
            onClick={handleExit}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden group"
          >
            <span className="material-symbols-outlined">quiz</span>
            Return to Library
          </button>
        </div>
      </main>
    </div>
  );
};

export default QuizResultsPage;
