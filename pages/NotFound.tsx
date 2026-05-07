import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const targetPath = isAuthenticated ? "/dashboard" : "/";

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-6">
      <div className="max-w-md text-center bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-card">
        <span className="material-symbols-outlined text-5xl text-primary mb-4">
          travel_explore
        </span>
        <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-3">
          Page not found
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          This route does not exist in the Elevana MVP.
        </p>
        <button
          type="button"
          onClick={() => navigate(targetPath, { replace: true })}
          className="px-5 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors"
        >
          Return {isAuthenticated ? "to Dashboard" : "Home"}
        </button>
      </div>
    </main>
  );
};

export default NotFound;
