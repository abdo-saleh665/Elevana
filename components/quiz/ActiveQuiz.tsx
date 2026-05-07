import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createQuizAttempt } from "../../quizAttempts";
import { useAppState } from "../../localStore";

interface ActiveQuizProps {
  onExit: () => void;
}

type QuizState = "active" | "confirm-submit";

const ActiveQuiz: React.FC<ActiveQuizProps> = ({ onExit }) => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const appState = useAppState();
  const activeQuizId = quizId || "biology-midterm";
  const quiz = appState.quizzes.find((item) => item.id === activeQuizId) || appState.quizzes[0];
  const questions = quiz.questions;
  const quizDurationSeconds = Math.max(60, quiz.estimatedMinutes * 60);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // valid questionId -> optionId
  const [quizState, setQuizState] = useState<QuizState>("active");
  const [timeRemaining, setTimeRemaining] = useState(quizDurationSeconds);
  const [startedAt] = useState(() => new Date().toISOString());
  const hasSubmittedRef = useRef(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progressPercentage =
    ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleOptionSelect = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizState("confirm-submit");
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = useCallback(() => {
    if (hasSubmittedRef.current) {
      return;
    }

    hasSubmittedRef.current = true;

    const elapsedSeconds = Math.max(
      0,
      Math.round((Date.now() - new Date(startedAt).getTime()) / 1000),
    );
    const attempt = createQuizAttempt({
      quizId: quiz.id,
      questions,
      answers,
      startedAt,
      elapsedSeconds,
    });

    navigate(`/quiz/results/${attempt.id}`, { state: attempt });
  }, [answers, navigate, questions, quiz.id, startedAt]);

  useEffect(() => {
    if (quizState === "active" && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizState, timeRemaining]);

  useEffect(() => {
    if (quizState === "active" && timeRemaining === 0) {
      handleSubmit();
    }
  }, [handleSubmit, quizState, timeRemaining]);

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 overflow-y-auto min-h-screen bg-background-light dark:bg-background-dark flex flex-col relative">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30 bg-[radial-gradient(at_40%_20%,hsla(228,100%,74%,0.1)_0px,transparent_50%),radial-gradient(at_80%_0%,hsla(189,100%,56%,0.1)_0px,transparent_50%),radial-gradient(at_0%_50%,hsla(340,100%,76%,0.1)_0px,transparent_50%)]"></div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl border-b border-neutral-200/60 dark:border-neutral-800/60 transition-all duration-300 ${quizState === "confirm-submit" ? "blur-sm grayscale" : ""}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-4 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="material-symbols-outlined text-white text-lg">
                  school
                </span>
              </div>
              <span className="font-bold text-xl tracking-tight text-neutral-800 dark:text-white font-display">
                Elevana
              </span>
            </div>
            <div className="h-5 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block"></div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                Current Quiz
              </span>
              <h1 className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[200px] lg:max-w-xs">
                {quiz.title}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 bg-slate-100/50 dark:bg-slate-800/50 border border-neutral-200 dark:border-neutral-800 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
              <span className="material-symbols-outlined text-lg text-primary-light dark:text-accent">
                timer
              </span>
              <span className="tabular-nums font-semibold">
                {formatTime(timeRemaining)}
              </span>
            </div>
            <button
              onClick={onExit}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all"
            >
              <span>Exit</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                logout
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Submit Confirmation Modal */}
      {quizState === "confirm-submit" && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setQuizState("active")}
          ></div>
          <div className="relative bg-white dark:bg-surface-dark rounded-3xl shadow-2xl p-10 max-w-sm w-full text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-primary dark:text-indigo-300 flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl">
                task_alt
              </span>
            </div>
            <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">
              Ready to Submit?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              You have answered{" "}
              <span className="font-bold text-neutral-800 dark:text-white">
                {Object.keys(answers).length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-neutral-800 dark:text-white">
                {totalQuestions}
              </span>{" "}
              questions. Submitting now will finalize your score.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setQuizState("active")}
                className="flex-1 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Review Answers
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Question Flow */}
      <main
        className={`flex-grow container mx-auto px-4 py-8 max-w-4xl relative z-10 transition-all duration-300 ${quizState === "confirm-submit" ? "blur-sm grayscale opacity-50" : ""}`}
      >
        <div className="mb-12">
          <div className="flex justify-between items-end mb-3 px-1">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-primary-light dark:text-accent uppercase tracking-widest mb-1">
                Question {currentQuestionIndex + 1}
              </span>
              <span className="text-2xl font-bold text-neutral-800 dark:text-white leading-none">
                {currentQuestion.topic}
              </span>
            </div>
            <span className="text-sm font-medium text-slate-400 dark:text-slate-500 bg-white dark:bg-surface-dark px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 shadow-sm">
              {currentQuestionIndex + 1}{" "}
              <span className="text-slate-300 mx-1">/</span> {totalQuestions}
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <section className="bg-white dark:bg-surface-dark rounded-3xl shadow-premium border border-neutral-100 dark:border-neutral-800/50 p-8 md:p-12 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-900/10 rounded-bl-full pointer-events-none"></div>

          <div className="mb-10 relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-primary dark:text-indigo-300 text-xs font-bold uppercase tracking-wide mb-4 border border-indigo-100 dark:border-indigo-800">
              <span className="material-symbols-outlined text-sm">
                category
              </span>
              Topic: {currentQuestion.topic}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-white leading-snug tracking-tight font-display">
              {currentQuestion.text}
            </h2>
          </div>

          <div className="space-y-4">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.id;

              return (
                <label
                  key={option.id}
                  className="relative group cursor-pointer block"
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    className="peer sr-only"
                    checked={isSelected}
                    readOnly
                  />
                  <div
                    className={`flex items-center p-5 rounded-2xl border transition-all duration-200 bg-white dark:bg-surface-dark ${isSelected ? "border-primary-light bg-indigo-50/50 dark:bg-indigo-900/20 dark:border-accent shadow-md shadow-indigo-100 dark:shadow-none" : "border-neutral-200 dark:border-neutral-800 hover:border-primary-light/30 dark:hover:border-accent/30 hover:bg-slate-50 dark:hover:bg-slate-700/30"}`}
                  >
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-5 flex items-center justify-center transition-all duration-200 ${isSelected ? "bg-primary-light border-primary-light dark:bg-accent dark:border-accent" : "border-slate-300 dark:border-slate-600 group-hover:border-primary-light dark:group-hover:border-accent"}`}
                    >
                      <span
                        className={`material-symbols-outlined text-[16px] text-white transition-opacity ${isSelected ? "opacity-100" : "opacity-0"}`}
                      >
                        check
                      </span>
                    </div>
                    <span
                      className={`text-lg font-medium transition-colors ${isSelected ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white"}`}
                    >
                      {option.text}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="mt-12 flex items-center justify-between pt-8 border-t border-neutral-100 dark:border-neutral-800/50">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border border-transparent font-semibold transition-all ${currentQuestionIndex === 0 ? "opacity-50 cursor-not-allowed text-slate-400" : "hover:border-neutral-200 dark:hover:border-neutral-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_back
              </span>
              Previous
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                {currentQuestionIndex === totalQuestions - 1
                  ? "Submit"
                  : "Next Question"}
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ActiveQuiz;
