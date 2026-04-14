import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import UpgradeModal from "./UpgradeModal";

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  // State for upgrade modal
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = React.useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-light dark:bg-surface-dark border-r border-neutral-200 dark:border-neutral-800 hidden md:flex flex-col z-20">
        <div className="p-8 pb-6">
          <div
            className="flex items-center gap-3.5 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white font-display">
              Eleva<span className="text-primary">na</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-4 space-y-1.5">
          <div>
            {[
              { path: "/dashboard", label: "Dashboard", icon: "dashboard" },
              {
                path: "/lectures",
                label: "My Lectures",
                icon: "library_books",
              },
              { path: "/schedule", label: "Schedule", icon: "calendar_month" },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium transition-all group ${
                  isActive(item.path)
                    ? "bg-indigo-50/80 dark:bg-indigo-900/20 text-primary-light dark:text-indigo-300 shadow-sm border border-indigo-100 dark:border-indigo-900/30"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[22px] ${
                    isActive(item.path)
                      ? ""
                      : "group-hover:text-primary-light dark:group-hover:text-indigo-400 transition-colors"
                  }`}
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </div>

          <div>
            {[
              { path: "/ai-tutor", label: "AI Tutor", icon: "auto_awesome" },
              { path: "/quiz", label: "Quizzes", icon: "quiz" },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium transition-all group ${
                  isActive(item.path)
                    ? "bg-indigo-50/80 dark:bg-indigo-900/20 text-primary-light dark:text-indigo-300 shadow-sm border border-indigo-100 dark:border-indigo-900/30"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[22px] ${
                    isActive(item.path)
                      ? ""
                      : "group-hover:text-primary-light dark:group-hover:text-indigo-400 transition-colors"
                  }`}
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Subscription Widget */}
        <div className="px-5 mb-2">
          <div className="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-900/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Free Plan
              </span>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>Uploads used</span>
                <span>3 / 5</span>
              </div>
              <div className="w-full bg-white dark:bg-gray-800 rounded-full h-1.5 overflow-hidden border border-indigo-100 dark:border-indigo-900/30">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mb-3">
              Resets in 12 days
            </p>

            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="w-full py-2 bg-white dark:bg-surface-dark border border-indigo-100 dark:border-indigo-900/30 rounded-xl text-[10px] font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300 hover:text-primary hover:border-primary/30 shadow-sm hover:shadow transition-all"
            >
              Get Unlimited Access
            </button>
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 dark:border-slate-800/50">
          <button
            onClick={() => navigate("/settings")}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium transition-all ${
              isActive("/settings")
                ? "bg-indigo-50/80 dark:bg-indigo-900/20 text-primary-light dark:text-indigo-300"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              settings
            </span>
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl font-medium transition-all mt-1"
          >
            <span className="material-symbols-outlined text-[22px]">
              logout
            </span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto bg-background-light dark:bg-background-dark relative">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-surface-light dark:bg-surface-dark border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center gap-2 font-display text-primary dark:text-white font-bold text-lg">
            <span className="material-symbols-outlined text-accent">
              school
            </span>
            Elevana
          </div>
          <button className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
        <Outlet />
      </main>

      <UpgradeModal
        open={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout;
