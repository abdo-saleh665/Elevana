import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import UpgradeModal from "./UpgradeModal";
import { useAuth } from "../auth";
import { updateAppState, useAppState } from "../localStore";

const MAIN_NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { path: "/lectures", label: "My Lectures", icon: "library_books" },
  { path: "/schedule", label: "Schedule", icon: "calendar_month" },
];

const TOOLS_NAV_ITEMS = [
  { path: "/ai-tutor", label: "AI Tutor", icon: "auto_awesome" },
  { path: "/quiz", label: "Quizzes", icon: "quiz" },
];

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const state = useAppState();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = React.useState(false);
  const uploadCount = state.lectureUploadsUsed;
  const uploadLimit = user?.plan === "pro" ? "Unlimited" : "5";
  const uploadPercent = user?.plan === "pro" ? 100 : Math.min(100, (uploadCount / 5) * 100);

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleMobileNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleMobileLogout = () => {
    handleLogout();
    setIsMobileMenuOpen(false);
  };

  const handleUpgrade = () => {
    if (!user) {
      return;
    }

    updateAppState((currentState) => ({
      ...currentState,
      users: currentState.users.map((item) =>
        item.id === user.id ? { ...item, plan: "pro" } : item,
      ),
    }));
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  const renderNavItems = (isMobile: boolean = false) => (
    <>
      <div>
        {MAIN_NAV_ITEMS.map((item) => (
          <button
            key={item.path}
            onClick={() => isMobile ? handleMobileNavClick(item.path) : navigate(item.path)}
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
        {TOOLS_NAV_ITEMS.map((item) => (
          <button
            key={item.path}
            onClick={() => isMobile ? handleMobileNavClick(item.path) : navigate(item.path)}
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
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[40] md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className="fixed inset-y-0 left-0 w-64 bg-surface-light dark:bg-surface-dark border-r border-neutral-200 dark:border-neutral-800 flex flex-col z-[50] transition-transform duration-300 ease-in-out md:hidden"
        style={{ transform: isMobileMenuOpen ? "translateX(0)" : "translateX(-100%)" }}
        role={isMobileMenuOpen ? "dialog" : undefined}
        aria-modal={isMobileMenuOpen ? "true" : undefined}
        aria-hidden={!isMobileMenuOpen}
        aria-label="Mobile Navigation Drawer"
      >
        <div className="p-5 pb-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800/50">
          <div
            className="flex items-center gap-3.5 cursor-pointer"
            onClick={() => handleMobileNavClick("/")}
          >
            <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white font-display">
              Eleva<span className="text-primary">na</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 -mr-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close Menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-4 space-y-1.5">
          {renderNavItems(true)}
        </nav>

        <div className="p-5 border-t border-slate-100 dark:border-slate-800/50">
          <button
            onClick={() => handleMobileNavClick("/settings")}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium transition-all ${
              isActive("/settings")
                ? "bg-indigo-50/80 dark:bg-indigo-900/20 text-primary-light dark:text-indigo-300 shadow-sm border border-indigo-100 dark:border-indigo-900/30"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              settings
            </span>
            Settings
          </button>
          <button
            onClick={handleMobileLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl font-medium transition-all mt-1"
          >
            <span className="material-symbols-outlined text-[22px]">
              logout
            </span>
            Logout
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
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
          {renderNavItems(false)}
        </nav>

        {/* Subscription Widget */}
        <div className="px-5 mb-2">
          <div className="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-900/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {user?.plan === "pro" ? "Pro Plan" : "Free Plan"}
              </span>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>Uploads used</span>
                <span>{uploadCount} / {uploadLimit}</span>
              </div>
              <div className="w-full bg-white dark:bg-gray-800 rounded-full h-1.5 overflow-hidden border border-indigo-100 dark:border-indigo-900/30">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${uploadPercent}%` }}
                ></div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mb-3">
              {user?.plan === "pro" ? "Unlimited local access enabled" : "Local demo limit"}
            </p>

            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="w-full py-2 bg-white dark:bg-surface-dark border border-indigo-100 dark:border-indigo-900/30 rounded-xl text-[10px] font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300 hover:text-primary hover:border-primary/30 shadow-sm hover:shadow transition-all"
            >
               {user?.plan === "pro" ? "Pro Enabled" : "Get Unlimited Access"}
            </button>
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 dark:border-slate-800/50">
          <button
            onClick={() => navigate("/settings")}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium transition-all ${
              isActive("/settings")
                ? "bg-indigo-50/80 dark:bg-indigo-900/20 text-primary-light dark:text-indigo-300 shadow-sm border border-indigo-100 dark:border-indigo-900/30"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
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
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Menu"
            aria-expanded={isMobileMenuOpen}
            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
        <Outlet />
      </main>

      <UpgradeModal
        open={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
};

export default DashboardLayout;
