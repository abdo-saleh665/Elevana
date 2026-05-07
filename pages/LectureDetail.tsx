import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import {
  createId,
  createQuizForLecture,
  removeLecture,
  updateAppState,
  useAppState,
  type StoredQuiz,
} from "../localStore";

type GenerateQuizResponse = {
  quiz?: Pick<StoredQuiz, "title" | "description" | "questions">;
  error?: string;
};

const LectureDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const appState = useAppState();
  const lecture = appState.lectures.find((item) => item.id === id) || null;
  const notes = id ? appState.lectureNotes[id] : null;
  const [searchQuery, setSearchQuery] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!lecture) return;

    updateAppState((state) => ({
      ...state,
      lectures: state.lectures.map((item) =>
        item.id === lecture.id
          ? { ...item, lastAccessedAt: new Date().toISOString(), studyProgress: Math.max(item.studyProgress, 75) }
          : item,
      ),
    }));
  }, [lecture?.id]);

  if (!lecture || !notes) {
    return <NotFound />;
  }

  const contentItems = notes.outline;
  const visibleBody = notes.body.filter((section) => {
    const query = searchQuery.trim().toLowerCase();
    return !query || `${section.title} ${section.content}`.toLowerCase().includes(query);
  });

  const startQuiz = async () => {
    const existingQuiz = appState.quizzes.find((quiz) => quiz.lectureId === lecture.id);

    if (existingQuiz) {
      navigate(`/active-quiz/${existingQuiz.id}`);
      return;
    }

    setStatusMessage("Generating quiz from lecture notes...");

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lectureTitle: lecture.title,
          notes,
          sourceText: lecture.sourceText,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as GenerateQuizResponse;

      if (!response.ok || !data.quiz) {
        throw new Error(data.error || "Unable to generate a quiz.");
      }

      const quiz: StoredQuiz = {
        id: createId("quiz"),
        lectureId: lecture.id,
        title: data.quiz.title,
        description: data.quiz.description,
        course: lecture.course,
        questions: data.quiz.questions,
        estimatedMinutes: Math.max(5, data.quiz.questions.length * 2),
        priority: "normal",
        generatedBy: "lecture-ai",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      updateAppState((state) => ({ ...state, quizzes: [quiz, ...state.quizzes] }));
      navigate(`/active-quiz/${quiz.id}`);
    } catch (caughtError) {
      const quiz = createQuizForLecture(lecture);
      updateAppState((state) => ({ ...state, quizzes: [quiz, ...state.quizzes] }));
      setStatusMessage(
        caughtError instanceof Error
          ? `${caughtError.message} Started a local fallback quiz instead.`
          : "Started a local fallback quiz.",
      );
      navigate(`/active-quiz/${quiz.id}`);
    }
  };

  const downloadNotes = () => {
    const text = [
      lecture.title,
      "",
      notes.summary,
      "",
      "Key Takeaways",
      ...notes.keyTakeaways.map((item) => `- ${item}`),
      "",
      ...notes.body.flatMap((section) => [section.title, section.content, ""]),
    ].join("\n");
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${lecture.title}.md`;
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage("Notes downloaded.");
  };

  const shareNotes = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setStatusMessage("Lecture link copied.");
  };

  const updateLectureFlag = (patch: Partial<typeof lecture>, message: string) => {
    updateAppState((state) => ({
      ...state,
      lectures: state.lectures.map((item) =>
        item.id === lecture.id ? { ...item, ...patch } : item,
      ),
    }));
    setStatusMessage(message);
  };

  const handleRemoveLecture = () => {
    const confirmed = window.confirm(
      `Remove "${lecture.title}" from this browser? This also removes its notes, generated quizzes, schedule items, and AI chats.`,
    );

    if (!confirmed) return;

    removeLecture(lecture.id);
    navigate("/lectures");
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-background-dark overflow-hidden font-sans text-slate-900 dark:text-slate-100">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark flex items-center justify-between px-6 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/lectures")}
            className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            aria-label="Back to lectures"
          >
            <span className="material-symbols-outlined text-[20px]">
              arrow_back
            </span>
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <button onClick={() => navigate("/lectures")} className="text-primary hover:underline cursor-pointer">
                {lecture.course}
              </button>
              <span className="material-symbols-outlined text-[10px]">
                chevron_right
              </span>
              <span>{lecture.term}</span>
            </div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
              {lecture.title}
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
                aria-label="Search notes"
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
                        href={`#${item.id}`}
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
                  {lecture.accuracyLabel}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <span className="material-symbols-outlined text-[14px]">
                    schedule
                  </span>
                  {lecture.readTime}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={startQuiz}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-lg shadow-indigo-500/20 transition-all font-semibold text-xs uppercase tracking-wide"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    quiz
                  </span>
                  Take Quiz
                </button>
                <button
                  onClick={() => navigate(`/ai-tutor?lectureId=${lecture.id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg transition-all font-semibold text-xs uppercase tracking-wide"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    auto_awesome
                  </span>
                  Ask AI
                </button>
                <button onClick={downloadNotes} className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800" aria-label="Download notes">
                  <span className="material-symbols-outlined text-[20px]">
                    download
                  </span>
                </button>
                <button onClick={handleRemoveLecture} className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20" aria-label="Remove lecture">
                  <span className="material-symbols-outlined text-[20px]">
                    delete
                  </span>
                </button>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white tracking-tight mb-6 leading-[1.1]">
              {lecture.title}
            </h1>

            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-light leading-relaxed mb-12 max-w-2xl">
              {lecture.description}
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
                  {notes.keyTakeaways.map((item, i) => (
                    <li key={i} className="flex items-start gap-3.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-2.5 flex-none box-content border-[3px] border-indigo-100 dark:border-indigo-900/30"></span>
                      <span className="text-slate-700 dark:text-slate-300 text-[1.05rem] leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Content Body */}
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none font-serif md:prose-xl">
              <p className="first-letter:text-6xl first-letter:font-bold first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:leading-[0.8] text-slate-600 dark:text-slate-300">
                {notes.summary}
              </p>

              {visibleBody.map((section, index) => (
                <React.Fragment key={section.id}>
                  <h3
                    id={section.id}
                    className="mt-12 font-bold mb-4 text-slate-900 dark:text-white"
                  >
                    {section.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[1.125rem]">
                    {section.content}
                  </p>

                  {index === 1 && (
                    <button
                      type="button"
                      onClick={() => setStatusMessage("Visualization expanded locally: compare each concept against a real course example.")}
                      className="my-14 w-full relative group cursor-pointer transition-transform hover:scale-[1.01] duration-300 text-left"
                    >
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
                            Click to expand a local study prompt
                          </p>
                        </div>
                      </div>
                    </button>
                  )}
                </React.Fragment>
              ))}

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
                    {notes.professorNotes[0]}
                  </p>
                </div>
              </div>
            </div>

            {/* Feedback footer */}
            <div className="mt-20 pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500">
              <span>Was this helpful?</span>
              <div className="flex items-center gap-2">
                <button onClick={() => updateLectureFlag({ feedback: "helpful" }, "Thanks. Feedback saved locally.")} className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors ${lecture.feedback === "helpful" ? "text-primary bg-indigo-50 dark:bg-indigo-900/20" : ""}`}>
                  <span className="material-symbols-outlined text-[18px]">
                    thumb_up
                  </span>
                </button>
                <button onClick={() => updateLectureFlag({ feedback: "not-helpful" }, "Feedback saved locally. Try asking AI for a simpler version.")} className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors ${lecture.feedback === "not-helpful" ? "text-primary bg-indigo-50 dark:bg-indigo-900/20" : ""}`}>
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
              onClick={() => updateLectureFlag({ bookmarked: !lecture.bookmarked }, lecture.bookmarked ? "Bookmark removed." : "Bookmark saved locally.")}
              className="group relative w-10 h-10 rounded-xl text-slate-400 hover:text-primary hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center justify-center transition-all"
              title="Bookmarks"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                {lecture.bookmarked ? "bookmark" : "bookmark_border"}
              </span>
            </button>
            <button
              onClick={() => setStatusMessage("Highlight mode saved locally. Select important ideas with notes search for now.")}
              className="group relative w-10 h-10 rounded-xl text-slate-400 hover:text-primary hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center justify-center transition-all"
              title="Highlights"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                border_color
              </span>
            </button>
            <button
              onClick={shareNotes}
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
      {statusMessage && (
        <div role="status" className="fixed bottom-6 left-6 z-50">
          <div className="bg-white dark:bg-surface-dark border border-indigo-100 dark:border-indigo-900/30 rounded-2xl shadow-premium p-4 flex items-center gap-3 max-w-xs animate-slide-up-fade text-sm text-slate-600 dark:text-slate-300">
            <span className="material-symbols-outlined text-primary">check_circle</span>
            {statusMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default LectureDetail;
