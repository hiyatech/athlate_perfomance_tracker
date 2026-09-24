import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import LoginSignupPage from './pages/Auth/LoginSignupPage';
import ProfilePage from './pages/Profile/ProfilePage';
import CreateTrainingPlanPage from './pages/Intelligence/CreateTrainingPlanPage';
import RecommendedPlanPage from './pages/Intelligence/RecommendedPlanPage';
import MyPlannedTrainingPage from './pages/Intelligence/MyPlannedTrainingPage';
import TrainingPageContainer from './pages/Training/TrainingPageContainer';
import PerformanceTab from './pages/Training/PerformanceTab';
import DashboardPage from './pages/Dashboard/DashboardPage';

// Private route wrapper enforcing authentication
function PrivateRoute({ children }) {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="p-8 text-brand-muted font-medium">Loading session...</div>;
  }

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex min-h-screen bg-brand-bg">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Route */}
          <Route path="/auth" element={<LoginSignupPage />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/intelligence"
            element={
              <PrivateRoute>
                <CreateTrainingPlanPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/intelligence/my-plans"
            element={
              <PrivateRoute>
                <MyPlannedTrainingPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/intelligence/result"
            element={
              <PrivateRoute>
                <RecommendedPlanPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/training"
            element={
              <PrivateRoute>
                <TrainingPageContainer />
              </PrivateRoute>
            }
          />
          <Route
            path="/performance"
            element={
              <PrivateRoute>
                <PerformanceTab />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
