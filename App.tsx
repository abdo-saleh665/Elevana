import React, { useState } from 'react';
import { View, User } from './types';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Lectures from './pages/Lectures';
import LectureDetail from './pages/LectureDetail';
import Schedule from './pages/Schedule';
import Quiz from './pages/Quiz';
import Settings from './pages/Settings';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [user, setUser] = useState<User | null>(null);

  // Simple mock authentication flow
  const handleLogin = () => {
    setUser({
      id: '1',
      name: 'Alex Morgan',
      email: 'alex.morgan@university.edu',
      plan: 'pro',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZqSawxwi_h7F6flOxmbBCroI532FWbizjtaDoRSuq6n5n18oiILC57PlKOHqK9xi5j8D7nuy78ikwDX3fefySAeJ_VF-4_T_087ZYOEScKpg_6tnkBE54kuGkwdOuh_5W4hBcE-TMTjgWK7FI7_ThW3Tvl0Y7DYvPfxkWjeu1iWAnMDJS2aOHNCDesuEGWOAM1qb3aunHHHJwFcEz7-FxjgmZp5ctcQtEV31-uarWE3i5pHKXSyHYkOVkRqKc4B-G1KuW7AvqZWw'
    });
    setCurrentView(View.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(View.LANDING);
  };

  const renderContent = () => {
    switch (currentView) {
      case View.LANDING:
        return <LandingPage onGetStarted={() => setCurrentView(View.AUTH)} onLogin={() => setCurrentView(View.AUTH)} />;
      case View.AUTH:
        return <AuthPage onLogin={handleLogin} onSignUp={() => setCurrentView(View.ONBOARDING)} />;
      case View.ONBOARDING:
        return <OnboardingPage onComplete={handleLogin} onBack={() => setCurrentView(View.AUTH)} />;
      case View.DASHBOARD:
        return <Dashboard />;
      case View.LECTURES:
        return <Lectures onViewNote={() => setCurrentView(View.LECTURE_DETAIL)} />;
      case View.LECTURE_DETAIL:
        return <LectureDetail onBack={() => setCurrentView(View.LECTURES)} />;
      case View.SCHEDULE:
        return <Schedule />;
      case View.QUIZ:
        return <Quiz onExit={() => setCurrentView(View.DASHBOARD)} />;
      case View.SETTINGS:
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  // If we are in the "authenticated" app views, wrap in DashboardLayout
  const isDashboardView = [
    View.DASHBOARD,
    View.LECTURES,
    View.LECTURE_DETAIL,
    View.SCHEDULE,
    View.SETTINGS
  ].includes(currentView);

  if (currentView === View.QUIZ) {
      return renderContent();
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-neutral-800 dark:text-gray-200 font-body">
      {isDashboardView ? (
        <DashboardLayout 
          currentView={currentView} 
          onChangeView={setCurrentView}
          user={user!}
          onLogout={handleLogout}
        >
          {renderContent()}
        </DashboardLayout>
      ) : (
        renderContent()
      )}
    </div>
  );
};

export default App;