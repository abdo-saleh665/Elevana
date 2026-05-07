import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import UpgradeModal from "../components/UpgradeModal";
import ConfirmModal from "../components/ConfirmModal";
import FilterDropdown from "../components/FilterDropdown";
import {
  createId,
  createLectureFromFile,
  createQuizForLecture,
  removeLecture,
  updateAppState,
  useAppState,
  type LectureNotes,
  type StoredQuiz,
  type StoredLecture,
} from "../localStore";

type ProcessMaterialResponse = {
  sourceText: string;
  lecturePatch: Partial<StoredLecture>;
  notes: Omit<LectureNotes, "lectureId" | "updatedAt">;
  error?: string;
};

type GenerateQuizResponse = {
  quiz?: Pick<StoredQuiz, "title" | "description" | "questions">;
  error?: string;
};

const Lectures: React.FC = () => {
  const navigate = useNavigate();
  const appState = useAppState();
  const { user } = useAuth();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [lectureToRemove, setLectureToRemove] = useState<StoredLecture | null>(null);
  const uploadLimit = user?.plan === "pro" ? Infinity : 5;
  const isLimitReached = appState.lectureUploadsUsed >= uploadLimit;

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateSort, setDateSort] = useState<"newest" | "oldest">("newest");

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  const ACCEPTED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/markdown",
  ];

  const courses = Array.from(new Set(appState.lectures.map((lecture) => lecture.course)));
  const statuses = ["all", "ready", "processing", "failed"];

  const visibleLectures = appState.lectures.filter((lecture) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesCourse = courseFilter === "all" || lecture.course === courseFilter;
    const matchesStatus = statusFilter === "all" || lecture.status === statusFilter;

    if (!matchesCourse || !matchesStatus) {
      return false;
    }

    return !query || `${lecture.title} ${lecture.course} ${lecture.description}`
      .toLowerCase()
      .includes(query);
  }).sort((a, b) => {
    const diff = new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    return dateSort === "newest" ? diff : -diff;
  });

  const cycleCourseFilter = () => {
    const options = ["all", ...courses];
    const index = options.indexOf(courseFilter);
    setCourseFilter(options[(index + 1) % options.length]);
  };

  const cycleStatusFilter = () => {
    const index = statuses.indexOf(statusFilter);
    setStatusFilter(statuses[(index + 1) % statuses.length]);
  };

    const handleRemoveLecture = (lecture: StoredLecture) => {
    setLectureToRemove(lecture);
  };

  const confirmRemoveLecture = () => {
    if (!lectureToRemove) return;
    removeLecture(lectureToRemove.id);
    setUploadError(null);
    setLectureToRemove(null);
  };

  const startLectureQuiz = async (lecture: StoredLecture) => {
    const existingQuiz = appState.quizzes.find((quiz) => quiz.lectureId === lecture.id);

    if (existingQuiz) {
      navigate(`/active-quiz/${existingQuiz.id}`);
      return;
    }

    const notes = appState.lectureNotes[lecture.id];

    if (!notes) {
      const quiz = createQuizForLecture(lecture);
      updateAppState((state) => ({
        ...state,
        quizzes: [quiz, ...state.quizzes],
      }));
      navigate(`/active-quiz/${quiz.id}`);
      return;
    }

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

      updateAppState((state) => ({
        ...state,
        quizzes: [quiz, ...state.quizzes],
      }));
      navigate(`/active-quiz/${quiz.id}`);
    } catch (caughtError) {
      const quiz = createQuizForLecture(lecture);
      updateAppState((state) => ({
        ...state,
        quizzes: [quiz, ...state.quizzes],
      }));
      setUploadError(
        caughtError instanceof Error
          ? `${caughtError.message} Started a local fallback quiz instead.`
          : "Started a local fallback quiz.",
      );
      navigate(`/active-quiz/${quiz.id}`);
    }
  };

  const handleFileSelect = async (file: File | null) => {
    if (!file) return;

    setUploadError(null);

    if (isLimitReached) {
      setUploadError("You've used all 5 free uploads. Removing lectures does not reset the upload count.");
      return;
    }

    const isAccepted = ACCEPTED_TYPES.includes(file.type) ||
      file.name.toLowerCase().endsWith('.pdf') ||
      file.name.toLowerCase().endsWith('.docx') ||
      file.name.toLowerCase().endsWith('.txt') ||
      file.name.toLowerCase().endsWith('.md');

    if (!isAccepted) {
      setUploadError("Invalid file type. Please upload a PDF, DOCX, TXT, or Markdown file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError("File is too large. Maximum size is 20MB.");
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);
    const lecture = createLectureFromFile(file);

    updateAppState((state) => ({
      ...state,
      lectureUploadsUsed: state.lectureUploadsUsed + 1,
      lectures: [lecture, ...state.lectures],
    }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", lecture.title);

      const response = await fetch("/api/process-material", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json().catch(() => ({}))) as ProcessMaterialResponse;

      if (!response.ok) {
        throw new Error(data.error || "Unable to process this material.");
      }

      updateAppState((state) => ({
        ...state,
        lectures: state.lectures.map((item) =>
          item.id === lecture.id
            ? {
                ...item,
                ...data.lecturePatch,
                sourceText: data.sourceText,
                status: "ready",
                progress: 100,
                studyProgress: Math.max(item.studyProgress, 10),
                generatedBy: "ai",
                processingError: undefined,
              }
            : item,
        ),
        lectureNotes: {
          ...state.lectureNotes,
          [lecture.id]: {
            ...data.notes,
            lectureId: lecture.id,
            updatedAt: new Date().toISOString(),
          },
        },
      }));
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to process this material.";
      updateAppState((state) => ({
        ...state,
        lectures: state.lectures.map((item) =>
          item.id === lecture.id
            ? {
                ...item,
                status: "failed",
                progress: 0,
                accuracyLabel: "Processing failed",
                processingError: message,
              }
            : item,
        ),
      }));
      setUploadError(message);
    } finally {
      setIsProcessing(false);
      setSelectedFile(null);
    }
  };

  const handleUpgrade = () => {
    if (!user) return;
    updateAppState((currentState) => ({
      ...currentState,
      users: currentState.users.map((item) =>
        item.id === user.id ? { ...item, plan: "pro" } : item,
      ),
    }));
    setIsUpgradeModalOpen(false);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (isLimitReached) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
      {/* Header Section */}
      <div className="flex flex-col gap-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">
              My Lectures
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-light tracking-wide">
              Manage your study materials and AI-generated notes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative group flex-1 sm:flex-none">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 text-[20px] group-focus-within:text-primary transition-colors">
                  search
                </span>
              </div>
              <input
                className="block w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                placeholder="Search lectures..."
                type="text"
                name="lectureSearch"
                aria-label="Search lectures"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>

            {/* View Toggle */}
            <div className="flex bg-white dark:bg-surface-dark p-1 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Show lectures as grid"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-indigo-50 text-primary shadow-sm"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  grid_view
                </span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="Show lectures as list"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-indigo-50 text-primary shadow-sm"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  view_list
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
          <FilterDropdown
            icon="filter_list"
            value={courseFilter}
            options={[
              { label: "All Courses", value: "all" },
              ...courses.map((course) => ({ label: course, value: course })),
            ]}
            onChange={setCourseFilter}
          />
          <FilterDropdown
            icon="calendar_today"
            labelPrefix="Date: "
            value={dateSort}
            options={[
              { label: "Newest First", value: "newest" },
              { label: "Oldest First", value: "oldest" },
            ]}
            onChange={(val) => setDateSort(val as "newest" | "oldest")}
          />
          <FilterDropdown
            icon="check_circle"
            labelPrefix="Status: "
            value={statusFilter}
            options={[
              { label: "Any", value: "all" },
              { label: "Ready", value: "ready" },
              { label: "Processing", value: "processing" },
              { label: "Failed", value: "failed" },
            ]}
            onChange={setStatusFilter}
          />
        </div>
      </div>

      {/* Upload Section */}
      <div className="mb-12">
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-surface-dark shadow-premium hover:shadow-xl transition-all duration-500 border border-indigo-50/60 dark:border-gray-800">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-50"></div>
          {isLimitReached ? (
            <div className="relative m-2 p-10 md:p-14 flex flex-col items-center justify-center text-center bg-indigo-50/30 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
               <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center mb-6 shadow-indigo-200/50 dark:shadow-none">
                  <span className="material-symbols-outlined text-white text-4xl">
                    workspace_premium
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                  Upload Limit Reached
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                  You've reached the limit of 5 uploads on the free plan. Upgrade to Elevana Pro to unlock unlimited uploads, advanced AI features, and more.
                </p>
                <button
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5"
                >
                  Upgrade to Pro
                </button>
            </div>
          ) : (
          <div
            className={`relative border-2 border-dashed rounded-xl m-2 p-10 md:p-14 flex flex-col items-center justify-center text-center transition-colors ${
              isDragging ? "border-primary bg-indigo-50/50 dark:bg-indigo-900/10" : "border-indigo-100/60 dark:border-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-700 bg-slate-50/30 dark:bg-transparent"
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              aria-label="Upload lecture file"
              className="hidden"
              accept=".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown"
              onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
            />

            {isProcessing ? (
              <div className="flex flex-col items-center animate-pulse">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full shadow-lg flex items-center justify-center mb-6 border border-indigo-100 dark:border-indigo-800">
                  <span className="material-symbols-outlined text-primary text-4xl animate-spin">
                    autorenew
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                  Processing {selectedFile?.name}
                </h3>
                <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                  Saving metadata locally...
                </p>
              </div>
            ) : (
              <>
                <div
                  className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center mb-6 hover:scale-110 hover:shadow-indigo-200/50 dark:hover:shadow-none transition-all duration-300 border border-indigo-50 dark:border-gray-700 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-violet-600 text-4xl">
                    cloud_upload
                  </span>
                </div>
                <h3
                  className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload New Lecture
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto leading-relaxed cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  Drag & drop your lecture PDF, DOCX, TXT, or Markdown file here. Elevana extracts text and generates notes locally through the MVP API.
                </p>

                {uploadError && (
                  <div className="mb-4 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg border border-red-100 dark:border-red-900/30">
                    {uploadError}
                  </div>
                )}

                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-6">
                  <span className="bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-100 dark:border-slate-700 shadow-sm">
                    PDF
                  </span>
                  <span className="bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-100 dark:border-slate-700 shadow-sm">
                    DOCX
                  </span>
                  <span className="bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-100 dark:border-slate-700 shadow-sm">
                    TXT
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>Max 20MB</span>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  Browse Files
                </button>
              </>
            )}
          </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          Recent Uploads
        </h2>
        <button onClick={() => { setSearchQuery(""); setCourseFilter("all"); setStatusFilter("all"); }} className="text-sm font-bold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
          View All
          <span className="material-symbols-outlined text-[18px]">
            arrow_forward
          </span>
        </button>
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            : "flex flex-col gap-4"
        }
      >
        {visibleLectures.map((lecture) => {
          const isReady = lecture.status === "ready";
          const progress = lecture.progress ?? 0;
          const iconClasses =
            lecture.status === "processing"
              ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
              : lecture.type === "DOCX"
                ? "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20"
                : "text-primary dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20";

          return (
            <div
              key={lecture.id}
              onClick={() => isReady && navigate(`/lectures/${lecture.id}`)}
              className={`group bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-premium transition-all duration-300 overflow-hidden ${
                isReady ? "cursor-pointer" : "cursor-default"
              } ${
                viewMode === "list"
                  ? `flex flex-row items-center p-4 hover:-translate-x-0 ${isReady ? "hover:border-primary/30" : "hover:border-amber-200"}`
                  : "flex flex-col hover:-translate-y-1"
              }`}
            >
              <div
                className={
                  viewMode === "list"
                    ? "flex items-center gap-6 flex-1"
                    : "p-6 flex-1 relative"
                }
              >
                {viewMode === "grid" && (
                  <div className="absolute top-6 right-6">
                    {isReady ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-900/30">
                        Ready
                      </span>
                    ) : lecture.status === "failed" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-900/30">
                        Failed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-900/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 animate-pulse"></span>
                        Processing
                      </span>
                    )}
                  </div>
                )}

                <div
                  className={`rounded-xl flex items-center justify-center shadow-sm ${isReady ? "group-hover:scale-110 transition-transform duration-300" : ""} ${
                    viewMode === "list"
                      ? `w-14 h-14 flex-shrink-0 ${iconClasses}`
                      : `w-12 h-12 mb-5 ${iconClasses}`
                  }`}
                >
                  <span className={`material-symbols-outlined text-2xl ${lecture.status === "processing" ? "animate-spin" : ""}`}>
                    {lecture.icon}
                  </span>
                </div>

                <div className={viewMode === "list" ? "flex-1 min-w-0" : ""}>
                  <h3
                    className={`font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors ${
                      viewMode === "list"
                        ? "text-base mb-1"
                        : "text-lg line-clamp-1 mb-2"
                    }`}
                  >
                    {lecture.title}
                  </h3>
                  <div
                    className={`flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 ${
                      viewMode === "list" ? "" : isReady ? "mb-4" : "mb-6"
                    }`}
                  >
                    <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                      {lecture.course}
                    </span>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span>{lecture.date}</span>
                  </div>

                  {isReady && viewMode === "grid" && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-light">
                      {lecture.description}
                    </p>
                  )}

                  {!isReady && (
                    <div className={viewMode === "list" ? "mt-2 w-48" : "space-y-2.5"}>
                      <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                        <span>{lecture.status === "failed" ? (lecture.processingError || "Processing failed") : viewMode === "list" ? "Extracting..." : "Extracting text content..."}</span>
                        <span>{progress}%</span>
                      </div>
                      <div className={`w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden ${viewMode === "list" ? "h-1" : "h-1.5"}`}>
                        <div
                          className={`${lecture.status === "failed" ? "bg-rose-500" : "bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]"} rounded-full ${viewMode === "list" ? "h-1" : "h-1.5"}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {viewMode === "list" && (
                  <div className="flex items-center gap-4 px-4">
                    {isReady ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-900/30">
                        Ready
                      </span>
                    ) : lecture.status === "failed" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-900/30">
                        Failed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-900/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 animate-pulse"></span>
                        Processing
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div
                className={
                  viewMode === "list"
                    ? "flex items-center gap-3 pl-6 border-l border-gray-100 dark:border-gray-800 ml-2"
                    : "px-6 py-4 bg-gray-50/80 dark:bg-[#131b2c] border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3"
                }
              >
                {isReady ? (
                  <>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          startLectureQuiz(lecture);
                        }}
                      className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm rounded-lg transition-all"
                    >
                      Take Quiz
                    </button>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/lectures/${lecture.id}`);
                      }}
                      className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-white bg-primary hover:bg-primary-dark rounded-lg shadow-md shadow-indigo-200 dark:shadow-none transition-all"
                    >
                      View Notes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      if (lecture.processingError) {
                        setUploadError(lecture.processingError);
                      }
                    }}
                    className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    {lecture.status === "failed" ? "View Error" : "Processing"}
                  </button>
                )}
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleRemoveLecture(lecture);
                  }}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <UpgradeModal
        open={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onUpgrade={() => {
            updateAppState((state) => ({
              ...state,
              users: state.users.map(u =>
                u.id === state.sessionUserId ? { ...u, plan: "pro" } : u
              )
            }));
        }}
      />
      <ConfirmModal
        open={!!lectureToRemove}
        title="Remove Lecture"
        message={`Are you sure you want to remove "${lectureToRemove?.title}"? This also removes its notes, generated quizzes, schedule items, and AI chats.`}
        confirmText="Remove"
        cancelText="Cancel"
        danger={true}
        onConfirm={confirmRemoveLecture}
        onClose={() => setLectureToRemove(null)}
      />
    </div>
  );
};

export default Lectures;
