import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Lectures: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
              />
            </div>

            {/* View Toggle */}
            <div className="flex bg-white dark:bg-surface-dark p-1 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm self-start sm:self-auto">
              <button
                onClick={() => setViewMode("grid")}
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
                onClick={() => setViewMode("list")}
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
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300 hover:border-primary/50 hover:text-primary active:bg-gray-50 dark:active:bg-gray-800 transition-all shadow-sm hover:shadow-md">
            <span className="material-symbols-outlined text-[18px] text-gray-400 group-hover:text-primary">
              filter_list
            </span>
            All Courses
            <span className="material-symbols-outlined text-[18px] text-gray-400">
              arrow_drop_down
            </span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300 hover:border-primary/50 hover:text-primary active:bg-gray-50 dark:active:bg-gray-800 transition-all shadow-sm hover:shadow-md">
            <span className="material-symbols-outlined text-[18px] text-gray-400 group-hover:text-primary">
              calendar_today
            </span>
            Date: Newest First
            <span className="material-symbols-outlined text-[18px] text-gray-400">
              arrow_drop_down
            </span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300 hover:border-primary/50 hover:text-primary active:bg-gray-50 dark:active:bg-gray-800 transition-all shadow-sm hover:shadow-md">
            <span className="material-symbols-outlined text-[18px] text-gray-400 group-hover:text-primary">
              check_circle
            </span>
            Status: Any
            <span className="material-symbols-outlined text-[18px] text-gray-400">
              arrow_drop_down
            </span>
          </button>
        </div>
      </div>

      {/* Upload Section */}
      <div className="mb-12 group cursor-pointer">
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-surface-dark shadow-premium hover:shadow-xl transition-all duration-500 border border-indigo-50/60 dark:border-gray-800">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-50"></div>
          <div className="relative border-2 border-dashed border-indigo-100/60 dark:border-indigo-900/20 group-hover:border-indigo-300 dark:group-hover:border-indigo-700 rounded-xl m-2 p-10 md:p-14 flex flex-col items-center justify-center text-center bg-slate-50/30 dark:bg-transparent transition-colors">
            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-indigo-200/50 dark:group-hover:shadow-none transition-all duration-300 border border-indigo-50 dark:border-gray-700">
              <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-violet-600 text-4xl">
                cloud_upload
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
              Upload New Lecture
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto leading-relaxed">
              Drag & drop your lecture PDF or audio file here. Our AI will
              instantly generate concise notes and interactive quizzes.
            </p>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-6">
              <span className="bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-100 dark:border-slate-700 shadow-sm">
                PDF
              </span>
              <span className="bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-100 dark:border-slate-700 shadow-sm">
                DOCX
              </span>
              <span className="bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-100 dark:border-slate-700 shadow-sm">
                MP3
              </span>
              <span className="text-slate-300">•</span>
              <span>Max 20MB</span>
            </div>
            <button className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5">
              Browse Files
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          Recent Uploads
        </h2>
        <button className="text-sm font-bold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
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
        {/* Card 1 */}
        <div
          onClick={() => navigate("/lectures/1")}
          className={`group bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-premium transition-all duration-300 overflow-hidden cursor-pointer ${
            viewMode === "list"
              ? "flex flex-row items-center p-4 hover:-translate-x-0 hover:border-primary/30"
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
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-900/30">
                  Ready
                </span>
              </div>
            )}

            <div
              className={`rounded-xl flex items-center justify-center text-primary dark:text-indigo-400 shadow-sm group-hover:scale-110 transition-transform duration-300 ${
                viewMode === "list"
                  ? "w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 flex-shrink-0"
                  : "w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 mb-5"
              }`}
            >
              <span className="material-symbols-outlined text-2xl">
                description
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
                Intro to Macroeconomics - Ch 3
              </h3>
              <div
                className={`flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 ${
                  viewMode === "list" ? "" : "mb-4"
                }`}
              >
                <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                  ECON 101
                </span>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span>Oct 24, 2023</span>
              </div>
              {viewMode === "grid" && (
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-light">
                  Topics covering supply and demand curves, market equilibrium,
                  and price elasticity...
                </p>
              )}
            </div>

            {viewMode === "list" && (
              <div className="flex items-center gap-4 px-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-900/30">
                  Ready
                </span>
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
            <button className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm rounded-lg transition-all">
              Take Quiz
            </button>
            <button className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-white bg-primary hover:bg-primary-dark rounded-lg shadow-md shadow-indigo-200 dark:shadow-none transition-all">
              View Notes
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div
          className={`group bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-premium transition-all duration-300 overflow-hidden cursor-pointer ${
            viewMode === "list"
              ? "flex flex-row items-center p-4 hover:-translate-x-0 hover:border-amber-200"
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
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-900/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 animate-pulse"></span>
                  Processing
                </span>
              </div>
            )}
            <div
              className={`rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm ${
                viewMode === "list"
                  ? "w-14 h-14 bg-amber-50 dark:bg-amber-900/20 flex-shrink-0"
                  : "w-12 h-12 bg-amber-50 dark:bg-amber-900/20 mb-5"
              }`}
            >
              <span className="material-symbols-outlined text-2xl">
                autorenew
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
                Advanced Machine Learning
              </h3>
              <div
                className={`flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 ${
                  viewMode === "list" ? "" : "mb-6"
                }`}
              >
                <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                  CS 405
                </span>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span>2 mins ago</span>
              </div>
              {viewMode === "grid" && (
                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                    <span>Extracting text content...</span>
                    <span>45%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-500 h-1.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>
              )}
              {viewMode === "list" && (
                <div className="mt-2 w-48">
                  <div className="flex justify-between text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                    <span>Extracting...</span>
                    <span>45%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-amber-500 h-1 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            {viewMode === "list" && (
              <div className="flex items-center gap-4 px-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-900/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 animate-pulse"></span>
                  Processing
                </span>
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
            <button
              className="text-sm font-semibold text-gray-400 cursor-not-allowed flex items-center gap-1"
              disabled
            >
              Wait to View
            </button>
          </div>
        </div>

        {/* Card 3 */}
        <div
          className={`group bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-premium transition-all duration-300 overflow-hidden cursor-pointer ${
            viewMode === "list"
              ? "flex flex-row items-center p-4 hover:-translate-x-0 hover:border-primary/30"
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
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-900/30">
                  Ready
                </span>
              </div>
            )}
            <div
              className={`rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-sm group-hover:scale-110 transition-transform duration-300 ${
                viewMode === "list"
                  ? "w-14 h-14 bg-teal-50 dark:bg-teal-900/20 flex-shrink-0"
                  : "w-12 h-12 bg-teal-50 dark:bg-teal-900/20 mb-5"
              }`}
            >
              <span className="material-symbols-outlined text-2xl">
                table_chart
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
                Data Structures - Binary Trees
              </h3>
              <div
                className={`flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 ${
                  viewMode === "list" ? "" : "mb-4"
                }`}
              >
                <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                  CS 201
                </span>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span>Oct 15, 2023</span>
              </div>
              {viewMode === "grid" && (
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-light">
                  Lecture notes on AVL trees, red-black tree properties, and
                  traversal algorithms.
                </p>
              )}
            </div>
            {viewMode === "list" && (
              <div className="flex items-center gap-4 px-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-900/30">
                  Ready
                </span>
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
            <button className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm rounded-lg transition-all">
              Take Quiz
            </button>
            <button className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-white bg-primary hover:bg-primary-dark rounded-lg shadow-md shadow-indigo-200 dark:shadow-none transition-all">
              View Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lectures;
