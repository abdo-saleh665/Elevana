import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Lectures from "./pages/Lectures";
import LectureDetail from "./pages/LectureDetail";
import Schedule from "./pages/Schedule";
import Quiz from "./pages/Quiz";
import AITutor from "./pages/AITutor";
import Settings from "./pages/Settings";
import ActiveQuizPage from "./pages/ActiveQuizPage";
import QuizResultsPage from "./pages/QuizResultsPage";
import NotFound from "./pages/NotFound";
import InfoPage from "./pages/InfoPage";
import { ProtectedRoute } from "./auth";

const App: React.FC = () => {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-neutral-800 dark:text-gray-200 font-body">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/terms" element={<InfoPage />} />
        <Route path="/privacy" element={<InfoPage />} />
        <Route path="/security" element={<InfoPage />} />
        <Route path="/help" element={<InfoPage />} />
        <Route path="/docs" element={<InfoPage />} />
        <Route path="/api-reference" element={<InfoPage />} />
        <Route path="/community" element={<InfoPage />} />
        <Route path="/integrations" element={<InfoPage />} />
        <Route path="/changelog" element={<InfoPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Note Detail Route (Values Full Screen) */}
          <Route path="/lectures/:id" element={<LectureDetail />} />

          {/* Active Quiz Route (Full Screen) */}
          <Route path="/active-quiz" element={<ActiveQuizPage />} />
          <Route path="/active-quiz/:quizId" element={<ActiveQuizPage />} />
          <Route path="/quiz/results" element={<QuizResultsPage />} />
          <Route path="/quiz/results/:attemptId" element={<QuizResultsPage />} />

          {/* Dashboard routes (wrapped in layout) */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lectures" element={<Lectures />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/ai-tutor" element={<AITutor />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
