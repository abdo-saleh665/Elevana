import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  updateAppState,
  useAppState,
  type VarkMode,
  type VarkScores,
} from "../localStore";

type VarkAnswer = {
  mode: VarkMode;
  label: string;
  desc: string;
  icon: string;
};

type VarkQuestion = {
  id: string;
  prompt: string;
  answers: VarkAnswer[];
};

const MODE_META: Record<VarkMode, { label: string; shortLabel: string; icon: string }> = {
  visual: { label: "Visual", shortLabel: "V", icon: "visibility" },
  auditory: { label: "Aural/Auditory", shortLabel: "A", icon: "headphones" },
  readWrite: { label: "Read/write", shortLabel: "R", icon: "menu_book" },
  kinesthetic: { label: "Kinesthetic", shortLabel: "K", icon: "science" },
};

const VARK_MODES: VarkMode[] = ["visual", "auditory", "readWrite", "kinesthetic"];

const emptyScores = (): VarkScores => ({
  visual: 0,
  auditory: 0,
  readWrite: 0,
  kinesthetic: 0,
});

const varkQuestions: VarkQuestion[] = [
  {
    id: "new-topic",
    prompt: "When a topic feels unfamiliar, what helps you get oriented first?",
    answers: [
      {
        mode: "visual",
        label: "A quick diagram",
        desc: "I want a map, chart, or labeled sketch before the details.",
        icon: "account_tree",
      },
      {
        mode: "auditory",
        label: "A clear explanation",
        desc: "I want someone to talk me through the idea in plain language.",
        icon: "record_voice_over",
      },
      {
        mode: "readWrite",
        label: "A written overview",
        desc: "I want headings, definitions, and a compact written summary.",
        icon: "article",
      },
      {
        mode: "kinesthetic",
        label: "A worked example",
        desc: "I want to try the process on a realistic problem.",
        icon: "build_circle",
      },
    ],
  },
  {
    id: "lecture-review",
    prompt: "After class, which review method feels most natural?",
    answers: [
      {
        mode: "visual",
        label: "Redraw the structure",
        desc: "I turn the lecture into timelines, boxes, or relationships.",
        icon: "draw",
      },
      {
        mode: "auditory",
        label: "Explain it out loud",
        desc: "I talk through the material or discuss it with someone.",
        icon: "forum",
      },
      {
        mode: "readWrite",
        label: "Rewrite the notes",
        desc: "I clean up notes, list key terms, and write summaries.",
        icon: "edit_note",
      },
      {
        mode: "kinesthetic",
        label: "Practice immediately",
        desc: "I use questions, cases, or drills to find what I missed.",
        icon: "quiz",
      },
    ],
  },
  {
    id: "memory-hook",
    prompt: "What usually makes information stick for you?",
    answers: [
      {
        mode: "visual",
        label: "Seeing patterns",
        desc: "Color, spacing, and layout help me remember where ideas fit.",
        icon: "palette",
      },
      {
        mode: "auditory",
        label: "Hearing the rhythm",
        desc: "Repeating phrases and listening to explanations helps recall.",
        icon: "graphic_eq",
      },
      {
        mode: "readWrite",
        label: "Writing it down",
        desc: "Lists, flashcards, and written definitions anchor the topic.",
        icon: "sticky_note_2",
      },
      {
        mode: "kinesthetic",
        label: "Using it in context",
        desc: "Doing the steps myself makes the idea feel real.",
        icon: "touch_app",
      },
    ],
  },
  {
    id: "hard-concept",
    prompt: "If you are stuck on a hard concept, what would you ask for?",
    answers: [
      {
        mode: "visual",
        label: "Show me the model",
        desc: "A diagram or comparison would make the hidden structure visible.",
        icon: "schema",
      },
      {
        mode: "auditory",
        label: "Talk me through it",
        desc: "A step-by-step spoken explanation would help me untangle it.",
        icon: "support_agent",
      },
      {
        mode: "readWrite",
        label: "Give me the text",
        desc: "A precise written explanation with terms defined would help.",
        icon: "notes",
      },
      {
        mode: "kinesthetic",
        label: "Let me test it",
        desc: "A practice case or simulation would show where I am confused.",
        icon: "experiment",
      },
    ],
  },
  {
    id: "exam-prep",
    prompt: "During exam prep, which resource would you open first?",
    answers: [
      {
        mode: "visual",
        label: "Mind map",
        desc: "I want the main ideas arranged by relationships.",
        icon: "hub",
      },
      {
        mode: "auditory",
        label: "Audio recap",
        desc: "I want a concise spoken review I can replay.",
        icon: "podcasts",
      },
      {
        mode: "readWrite",
        label: "Study guide",
        desc: "I want bullet points, definitions, and key questions.",
        icon: "library_books",
      },
      {
        mode: "kinesthetic",
        label: "Practice set",
        desc: "I want to solve questions and check my mistakes.",
        icon: "task_alt",
      },
    ],
  },
  {
    id: "group-study",
    prompt: "In a study group, what role do you naturally take?",
    answers: [
      {
        mode: "visual",
        label: "Draw the board",
        desc: "I organize the conversation into visible structure.",
        icon: "dashboard_customize",
      },
      {
        mode: "auditory",
        label: "Lead the discussion",
        desc: "I learn by asking questions and hearing answers.",
        icon: "groups",
      },
      {
        mode: "readWrite",
        label: "Capture the notes",
        desc: "I turn the discussion into organized written takeaways.",
        icon: "fact_check",
      },
      {
        mode: "kinesthetic",
        label: "Run the drill",
        desc: "I push the group toward cases, quiz rounds, or examples.",
        icon: "sports_score",
      },
    ],
  },
  {
    id: "ai-notes",
    prompt: "How should Elevana shape generated notes for you?",
    answers: [
      {
        mode: "visual",
        label: "Use visual structure",
        desc: "Add tables, concept maps, and highlighted relationships.",
        icon: "table_chart",
      },
      {
        mode: "auditory",
        label: "Use explainable scripts",
        desc: "Make notes easy to read aloud or listen to later.",
        icon: "volume_up",
      },
      {
        mode: "readWrite",
        label: "Use precise text",
        desc: "Prioritize definitions, summaries, and organized bullet points.",
        icon: "format_list_bulleted",
      },
      {
        mode: "kinesthetic",
        label: "Use active practice",
        desc: "Add cases, quiz prompts, and apply-it-now tasks.",
        icon: "psychology_alt",
      },
    ],
  },
  {
    id: "confidence",
    prompt: "When do you feel confident that you understand something?",
    answers: [
      {
        mode: "visual",
        label: "I can picture it",
        desc: "I can see how the parts connect in my head.",
        icon: "visibility",
      },
      {
        mode: "auditory",
        label: "I can explain it",
        desc: "I can say it clearly without losing the thread.",
        icon: "campaign",
      },
      {
        mode: "readWrite",
        label: "I can define it",
        desc: "I can write the key terms and steps accurately.",
        icon: "text_snippet",
      },
      {
        mode: "kinesthetic",
        label: "I can apply it",
        desc: "I can use it correctly in a new question or scenario.",
        icon: "engineering",
      },
    ],
  },
];

const calculateScores = (answers: Partial<Record<string, VarkMode>>): VarkScores => {
  return varkQuestions.reduce((scores, question) => {
    const mode = answers[question.id];

    if (mode) {
      scores[mode] += 1;
    }

    return scores;
  }, emptyScores());
};

const getVarkResult = (scores: VarkScores) => {
  const topScore = Math.max(...VARK_MODES.map((mode) => scores[mode]));
  const modes = VARK_MODES.filter((mode) => topScore > 0 && topScore - scores[mode] <= 1);
  const label = modes.length > 1
    ? `Multimodal: ${modes.map((mode) => MODE_META[mode].label).join(" + ")}`
    : MODE_META[modes[0] || "readWrite"].label;

  return { modes: modes.length ? modes : (["readWrite"] as VarkMode[]), label };
};

const getFallbackLearningStyle = (learningStyle?: string, settingsLearningStyle?: string) => (
  learningStyle || settingsLearningStyle || "Read/write"
);

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const appState = useAppState();
  const [answers, setAnswers] = useState<Partial<Record<string, VarkMode>>>({});
  const [weeklyCommitment, setWeeklyCommitment] = useState(appState.onboarding.weeklyCommitment);
  const [intensity, setIntensity] = useState(appState.onboarding.goalIntensity);
  const [step, setStep] = useState<"questions" | "result">("questions");
  const [validationMessage, setValidationMessage] = useState("");

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = varkQuestions.length - answeredCount;
  const progressPercent = Math.round((answeredCount / varkQuestions.length) * 100);
  const scores = useMemo(() => calculateScores(answers), [answers]);
  const result = useMemo(() => getVarkResult(scores), [scores]);

  const handleAnswer = (questionId: string, mode: VarkMode) => {
    setAnswers((currentAnswers) => ({ ...currentAnswers, [questionId]: mode }));
    setValidationMessage("");
  };

  const showResult = () => {
    if (unansweredCount > 0) {
      setValidationMessage(
        `Answer ${unansweredCount} more ${unansweredCount === 1 ? "question" : "questions"} to see your result.`,
      );
      return;
    }

    setValidationMessage("");
    setStep("result");
  };

  const saveOnboarding = () => {
    updateAppState((state) => ({
      ...state,
      onboarding: {
        ...state.onboarding,
        completed: true,
        learningStyle: result.label,
        learningStyleScores: scores,
        learningStyleModes: result.modes,
        learningStyleResultLabel: result.label,
        weeklyCommitment,
        goalIntensity: intensity,
        completedAt: new Date().toISOString(),
      },
      settings: {
        ...state.settings,
        learningStyle: result.label,
      },
    }));
    navigate("/dashboard");
  };

  const saveWithoutAssessment = () => {
    updateAppState((state) => {
      const preservedStyle = getFallbackLearningStyle(
        state.onboarding.learningStyleResultLabel || state.onboarding.learningStyle,
        state.settings.learningStyle,
      );

      return {
        ...state,
        onboarding: {
          ...state.onboarding,
          completed: true,
          learningStyle: preservedStyle,
          weeklyCommitment,
          goalIntensity: intensity,
          completedAt: new Date().toISOString(),
        },
        settings: {
          ...state.settings,
          learningStyle: preservedStyle,
        },
      };
    });
    navigate("/dashboard");
  };

  const renderQuestionStep = () => (
    <>
      <div className="mb-8 text-center sm:text-left">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="bg-indigo-50 dark:bg-indigo-900/30 text-primary dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-800/50">
              Step 1 of 2
            </span>
            <span className="text-sm font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              VARK-style profile
            </span>
          </div>
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
            {answeredCount}/{varkQuestions.length} answered
          </span>
        </div>
        <div className="mb-8 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
          Find your learning preference
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Answer a short original VARK-style check so Elevana can shape notes,
          review prompts, and practice around how you prefer to learn.
        </p>
      </div>

      <div className="space-y-7 mb-10">
        {varkQuestions.map((question, index) => (
          <section
            key={question.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-5 sm:p-6"
          >
            <div className="mb-5 flex items-start gap-4">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-sm font-bold text-primary dark:bg-indigo-900/30 dark:text-indigo-300">
                {index + 1}
              </div>
              <h2 className="text-lg font-bold leading-snug text-slate-900 dark:text-white">
                {question.prompt}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {question.answers.map((answer) => {
                const isSelected = answers[question.id] === answer.mode;

                return (
                  <label key={`${question.id}-${answer.mode}`} className="cursor-pointer">
                    <input
                      type="radio"
                      name={question.id}
                      value={answer.mode}
                      checked={isSelected}
                      onChange={() => handleAnswer(question.id, answer.mode)}
                      className="peer sr-only"
                    />
                    <div className="h-full rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-primary/40 hover:bg-white dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-primary/50 peer-checked:border-primary peer-checked:bg-indigo-50/70 peer-checked:ring-2 peer-checked:ring-primary/20 dark:peer-checked:bg-indigo-900/20">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span
                          className={`grid h-10 w-10 place-items-center rounded-lg border transition-colors ${
                            isSelected
                              ? "border-primary bg-primary text-white"
                              : "border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[22px]">
                            {answer.icon}
                          </span>
                        </span>
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-300">
                          {MODE_META[answer.mode].shortLabel}
                        </span>
                      </div>
                      <h3 className="mb-1 font-bold text-slate-900 dark:text-white">
                        {answer.label}
                      </h3>
                      <p className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                        {answer.desc}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>
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
                  onChange={(e) => setIntensity(Number(e.target.value))}
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

      {validationMessage && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200">
          {validationMessage}
        </div>
      )}

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
            onClick={saveWithoutAssessment}
            className="hidden sm:inline-block text-sm font-semibold text-slate-400 hover:text-primary transition-colors"
          >
            Skip assessment
          </button>
          <button
            onClick={showResult}
            className={`w-full sm:w-auto text-white font-semibold text-base px-8 py-3.5 rounded-xl shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group ${
              unansweredCount === 0
                ? "bg-primary hover:bg-primary-dark shadow-primary/30 hover:shadow-primary/50"
                : "bg-slate-400 shadow-slate-300 dark:bg-slate-700 dark:shadow-black/20"
            }`}
            type="button"
          >
            See results
            <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </>
  );

  const renderResultStep = () => (
    <>
      <div className="mb-10 text-center sm:text-left">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-indigo-50 dark:bg-indigo-900/30 text-primary dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-800/50">
            Step 2 of 2
          </span>
          <span className="text-sm font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
            Learning result
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
          {result.label}
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Elevana will save this profile with your study goals and use it as a
          preference signal for notes, review prompts, and practice.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-10 sm:grid-cols-2">
        {VARK_MODES.map((mode) => {
          const score = scores[mode];
          const width = `${Math.round((score / varkQuestions.length) * 100)}%`;
          const isResultMode = result.modes.includes(mode);

          return (
            <div
              key={mode}
              className={`rounded-2xl border p-5 ${
                isResultMode
                  ? "border-primary bg-indigo-50/70 dark:bg-indigo-900/20"
                  : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50"
              }`}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-xl ${
                      isResultMode
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {MODE_META[mode].icon}
                    </span>
                  </span>
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white">
                      {MODE_META[mode].label}
                    </h2>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {MODE_META[mode].shortLabel} score
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {score}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/50">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
          <span className="material-symbols-outlined text-primary">
            flag
          </span>
          Study Goals
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Weekly commitment
            </p>
            <p className="mt-1 font-bold text-slate-900 dark:text-white">
              {weeklyCommitment}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Goal intensity
            </p>
            <p className="mt-1 font-bold text-slate-900 dark:text-white">
              {intensity}/100
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 pt-6 mt-6 border-t border-transparent">
        <button
          onClick={() => setStep("questions")}
          className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          type="button"
        >
          Edit answers
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
    </>
  );

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
          onClick={saveWithoutAssessment}
        >
          Save & Exit
        </button>
      </nav>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 translate-y-1/3"></div>

        <div className="w-full max-w-5xl bg-surface-light dark:bg-surface-dark rounded-2xl shadow-premium overflow-hidden relative backdrop-blur-sm border border-slate-100 dark:border-slate-800 z-10">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent shadow-[0_0_10px_rgba(79,70,229,0.5)] transition-all duration-300"
              style={{ width: step === "questions" ? `${Math.max(8, progressPercent / 2)}%` : "100%" }}
            />
          </div>

          <div className="p-8 sm:p-12 lg:p-14">
            {step === "questions" ? renderQuestionStep() : renderResultStep()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage;
