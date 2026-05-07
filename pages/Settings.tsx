import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import UpgradeModal from "../components/UpgradeModal";
import { useAuth } from "../auth";
import { resetLocalAppState, updateAppState, useAppState } from "../localStore";

interface SettingsState {
  fullName: string;
  email: string;
  learningStyle: string;
  theme: "light" | "dark";
  dailyReminders: boolean;
  quizAlerts: boolean;
}

const getDefaultState = (): SettingsState => ({
  fullName: "Alex Student",
  email: "alex.student@university.edu",
  learningStyle: "Text-Based (Bullet points & Summaries)",
  theme: "light",
  dailyReminders: false,
  quizAlerts: true,
});

const sectionIds = ["profile", "app-preferences", "subscription", "security"];
const sectionLabels = [
  "Profile",
  "App Preferences",
  "Subscription",
  "Security",
];
const sectionIcons = ["person", "tune", "card_membership", "security"];

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const appState = useAppState();
  const fullNameRef = useRef<HTMLInputElement | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const getStoreSettings = (): SettingsState => ({
    fullName: user?.name || "Alex Student",
    email: user?.email || "alex.student@university.edu",
    learningStyle: appState.settings.learningStyle,
    theme: appState.settings.theme,
    dailyReminders: appState.settings.dailyReminders,
    quizAlerts: appState.settings.quizAlerts,
  });
  const [initialState, setInitialState] = useState<SettingsState>(getStoreSettings);
  const [formData, setFormData] = useState<SettingsState>(getStoreSettings);
  const [activeSection, setActiveSection] = useState("profile");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const hasChanges = JSON.stringify(initialState) !== JSON.stringify(formData);

  const applyTheme = (theme: "light" | "dark") => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleChange = (field: keyof SettingsState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateAppState((state) => ({
      ...state,
      settings: {
        ...state.settings,
        learningStyle: formData.learningStyle,
        theme: formData.theme,
        dailyReminders: formData.dailyReminders,
        quizAlerts: formData.quizAlerts,
      },
      users: state.users.map((item) =>
        item.id === user?.id
          ? { ...item, name: formData.fullName, email: formData.email.trim().toLowerCase() }
          : item,
      ),
    }));
    applyTheme(formData.theme);
    setInitialState(formData);
    setStatusMessage("Settings saved locally.");
  };

  const handleCancel = () => {
    setFormData(initialState);
  };

  const handleUpgrade = () => {
    if (!user) return;

    updateAppState((state) => ({
      ...state,
      users: state.users.map((item) =>
        item.id === user.id ? { ...item, plan: "pro" } : item,
      ),
    }));
    setStatusMessage("Pro plan enabled locally.");
  };

  const handleChangePassword = () => {
    const password = window.prompt("Enter a new local password (minimum 8 characters):");

    if (!password) return;

    if (password.length < 8) {
      setStatusMessage("Password must be at least 8 characters.");
      return;
    }

    updateAppState((state) => ({
      ...state,
      users: state.users.map((item) =>
        item.id === user?.id ? { ...item, password } : item,
      ),
    }));
    setStatusMessage("Password changed locally.");
  };

  const handleRevokeSession = () => {
    setStatusMessage("Secondary demo session revoked locally.");
  };

  const handleResetLocalData = () => {
    const confirmed = window.confirm(
      "Reset all local Elevana data in this browser? This clears localStorage, including local Pro access.",
    );

    if (!confirmed) return;

    resetLocalAppState();
    setInitialState(getDefaultState());
    setFormData(getDefaultState());
    setStatusMessage("All local browser data reset.");
  };

  // Scroll to section without changing URL hash (so back button works correctly)
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Intersection Observer for active section tracking
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8 pb-[60vh]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md mb-8 flex items-center gap-4 py-4 -mx-6 px-6 md:-mx-10 md:px-10 border-b border-slate-200/60 dark:border-slate-700/40">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-serif">
            Settings
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar Menu with active section highlighting */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-32 space-y-1">
            <p className="px-4 pb-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              Menu
            </p>
            {sectionLabels.map((item, idx) => (
              <button
                key={item}
                onClick={() => scrollToSection(sectionIds[idx])}
                className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                  activeSection === sectionIds[idx]
                    ? "bg-white dark:bg-slate-800 text-primary dark:text-indigo-300 font-semibold shadow-sm border border-slate-100 dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/50 hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {sectionIcons[idx]}
                </span>
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-8">
          {/* Profile Section */}
          <section
            id="profile"
            className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-slate-200/60 dark:border-slate-700 p-8 shadow-sm scroll-mt-24"
          >
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-700/50 pb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
                  Profile Information
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Update your photo and personal details.
                </p>
              </div>
              <button onClick={() => fullNameRef.current?.focus()} className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                Edit Profile
              </button>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div onClick={() => fullNameRef.current?.focus()} className="relative group cursor-pointer self-center md:self-start">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZqSawxwi_h7F6flOxmbBCroI532FWbizjtaDoRSuq6n5n18oiILC57PlKOHqK9xi5j8D7nuy78ikwDX3fefySAeJ_VF-4_T_087ZYOEScKpg_6tnkBE54kuGkwdOuh_5W4hBcE-TMTjgWK7FI7_ThW3Tvl0Y7DYvPfxkWjeu1iWAnMDJS2aOHNCDesuEGWOAM1qb3aunHHHJwFcEz7-FxjgmZp5ctcQtEV31-uarWE3i5pHKXSyHYkOVkRqKc4B-G1KuW7AvqZWw"
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-slate-800 ring-2 ring-indigo-100 dark:ring-indigo-900"
                />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity m-1">
                  <span className="material-symbols-outlined text-white">
                    camera_alt
                  </span>
                </div>
              </div>
              <div className="flex-1 space-y-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
                    <input ref={fullNameRef} id="fullName" name="fullName" autoComplete="name" type="text" value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary block p-3 transition-shadow shadow-sm outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <input id="email" name="email" autoComplete="email" type="email" value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium rounded-xl block p-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-3 text-slate-400 text-lg">
                        mail
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="learning-style" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Learning Style Preference
                  </label>
                  <p className="text-xs text-slate-400 mb-2">
                    This helps our AI generate better notes for you.
                  </p>
                  <div className="relative">
                    <select
                      id="learning-style"
                      name="learningStyle"
                      value={formData.learningStyle}
                      onChange={(e) =>
                        handleChange("learningStyle", e.target.value)
                      }
                      className="w-full appearance-none bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary block p-3 pr-10 outline-none transition-shadow shadow-sm"
                    >
                      <option>
                        Text-Based (Bullet points &amp; Summaries)
                      </option>
                      <option>Visual (Diagrams &amp; Mind Maps)</option>
                      <option>Auditory (Text-to-Speech optimized)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <span className="material-symbols-outlined">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* App Preferences Section */}
          <section
            id="app-preferences"
            className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-slate-200/60 dark:border-slate-700 p-8 shadow-sm scroll-mt-24"
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-700/50 pb-6 font-display">
              App Preferences
            </h2>

            <div className="space-y-6">
              {/* Appearance */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-200">
                    Appearance
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Customize how Elevana looks on your device.
                  </p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => handleChange("theme", "light")}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
                      formData.theme === "light"
                        ? "bg-white text-slate-800 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      light_mode
                    </span>
                    LIGHT
                  </button>
                  <button
                    onClick={() => handleChange("theme", "dark")}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
                      formData.theme === "dark"
                        ? "bg-slate-700 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      dark_mode
                    </span>
                    DARK
                  </button>
                </div>
              </div>

              {/* Daily Study Reminders */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-200">
                    Daily Study Reminders
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Receive a motivational notification at 9:00 AM daily.
                  </p>
                </div>
                <button role="switch" aria-checked={formData.dailyReminders} onClick={() => handleChange("dailyReminders", !formData.dailyReminders)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-200 ease-in-out ${
                    formData.dailyReminders
                      ? "bg-primary"
                      : "bg-slate-200 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
                      formData.dailyReminders
                        ? "translate-x-6"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* New Quiz Alerts */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-200">
                    New Quiz Alerts
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Get notified instantly when AI generates new quizzes.
                  </p>
                </div>
                <button role="switch" aria-checked={formData.quizAlerts} onClick={() => handleChange("quizAlerts", !formData.quizAlerts)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-200 ease-in-out ${
                    formData.quizAlerts
                      ? "bg-primary"
                      : "bg-slate-200 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm flex items-center justify-center transform transition-transform duration-200 ease-in-out ${
                      formData.quizAlerts ? "translate-x-6" : "translate-x-0"
                    }`}
                  >
                    {formData.quizAlerts && (
                      <span className="material-symbols-outlined text-[10px] text-primary font-bold">
                        check
                      </span>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* Subscription Section */}
          <section
            id="subscription"
            className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-slate-200/60 dark:border-slate-700 p-8 shadow-sm scroll-mt-24"
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700/50 pb-6 font-display">
              Subscription
            </h2>

            <div className="bg-gradient-to-r from-slate-50 to-indigo-50/20 dark:from-slate-800 dark:to-indigo-900/20 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-200/50 dark:bg-indigo-800/50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary dark:text-indigo-300 text-2xl">
                      star
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {user?.plan === "pro" ? "Pro Plan" : "Free Plan"}
                    </h3>
                    <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full uppercase">
                      Current
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {user?.plan === "pro" ? "Demo Pro access enabled in this browser only." : "Local MVP note generation and quiz access."}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 flex items-center gap-2 transition-all transform hover:scale-105"
              >
                <span className="material-symbols-outlined text-lg">
                  auto_awesome
                </span>
                {user?.plan === "pro" ? "Manage Pro" : "Upgrade to Pro"}
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                "Unlimited AI Note Generation",
                "Lecture-grounded AI Tutor",
                "Local quiz and schedule tracking",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400"
                >
                  <span className="material-symbols-outlined text-green-500 text-lg">
                    check_circle
                  </span>
                  {feature}
                </div>
              ))}
            </div>
          </section>

          {/* Security Section */}
          <section
            id="security"
            className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-slate-200/60 dark:border-slate-700 p-8 shadow-sm scroll-mt-24"
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-700/50 pb-6 font-display">
              Security
            </h2>

            <div className="space-y-8">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-200">
                    Local Demo Password
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Stored in browser storage for MVP testing only.
                  </p>
                </div>
                <button onClick={handleChangePassword} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wide px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-rose-50 dark:bg-rose-900/10 rounded-xl border border-rose-100 dark:border-rose-900/30">
                <div>
                  <h3 className="font-bold text-rose-900 dark:text-rose-200">
                    Reset Local Demo Data
                  </h3>
                  <p className="text-sm text-rose-700/70 dark:text-rose-300/80 mt-1">
                    Clears this website's localStorage, including local users, Pro access, lectures, quizzes, schedule items, and chats.
                  </p>
                </div>
                <button onClick={handleResetLocalData} className="bg-white dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 font-bold text-xs uppercase tracking-wide px-4 py-2 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors">
                  Reset
                </button>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Active Sessions
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-primary dark:text-indigo-400">
                        <span className="material-symbols-outlined">
                          laptop_mac
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                            Macbook Pro
                          </h4>
                          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                            Current
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          San Francisco, USA • Chrome • Active now
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                        <span className="material-symbols-outlined">
                          smartphone
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          iPhone 14
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          San Francisco, USA • Elevana App • 2 hours ago
                        </p>
                      </div>
                    </div>
                    <button onClick={handleRevokeSession} className="text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-wide transition-colors">
                      Revoke
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Conditional Footer - only shows when changes are made */}
      <AnimatePresence>
        {statusMessage && !hasChanges && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg"
          >
            {statusMessage}
          </motion.div>
        )}
        {hasChanges && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 py-4 px-6 md:px-10 flex justify-end gap-4 z-40"
          >
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition-all transform hover:-translate-y-0.5"
            >
              Save Changes
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Modal */}
      <UpgradeModal
        open={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
};

export default Settings;
