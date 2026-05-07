import React, { Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./auth";

const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const SignupPage = React.lazy(() => import("./pages/SignupPage"));
const OnboardingPage = React.lazy(() => import("./pages/OnboardingPage"));
const DashboardLayout = React.lazy(() => import("./components/DashboardLayout"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Lectures = React.lazy(() => import("./pages/Lectures"));
const LectureDetail = React.lazy(() => import("./pages/LectureDetail"));
const Schedule = React.lazy(() => import("./pages/Schedule"));
const Quiz = React.lazy(() => import("./pages/Quiz"));
const AITutor = React.lazy(() => import("./pages/AITutor"));
const Settings = React.lazy(() => import("./pages/Settings"));
const ActiveQuizPage = React.lazy(() => import("./pages/ActiveQuizPage"));
const QuizResultsPage = React.lazy(() => import("./pages/QuizResultsPage"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const InfoPage = React.lazy(() => import("./pages/InfoPage"));

const PageLoader: React.FC = () => (
  <div className="grid min-h-screen place-items-center bg-background-light text-primary dark:bg-background-dark dark:text-indigo-300">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-current border-t-transparent" />
  </div>
);

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
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </div>
  );
};

export default App;
