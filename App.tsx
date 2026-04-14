import React from "react";
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

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-neutral-800 dark:text-gray-200 font-body">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Standalone Pages */}
        <Route path="/settings" element={<Settings />} />

        {/* Note Detail Route (Values Full Screen) */}
        <Route path="/lectures/:id" element={<LectureDetail />} />

        {/* Active Quiz Route (Full Screen) */}
        <Route path="/active-quiz" element={<ActiveQuizPage />} />
        <Route path="/quiz/results" element={<QuizResultsPage />} />

        {/* Dashboard routes (wrapped in layout) */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lectures" element={<Lectures />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/ai-tutor" element={<AITutor />} />
          <Route path="/quiz" element={<Quiz />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
