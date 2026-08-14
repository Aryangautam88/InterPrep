import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './routes/ProtectedRoute';
import GuestOnly from './routes/GuestOnly';
import AppLayout from './layouts/AppLayout';
import Landing from './pages/public/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RoleDashboard from './pages/app/RoleDashboard';
import ComingSoon from './pages/app/ComingSoon';
import Settings from './pages/app/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route
                path="/login"
                element={
                  <GuestOnly>
                    <Login />
                  </GuestOnly>
                }
              />
              <Route
                path="/register"
                element={
                  <GuestOnly>
                    <Register />
                  </GuestOnly>
                }
              />
              <Route element={<ProtectedRoute />}>
                <Route path="/app" element={<AppLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<RoleDashboard />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="preparation" element={<ComingSoon title="Preparation tracker" />} />
                  <Route path="companies" element={<ComingSoon title="Companies" />} />
                  <Route path="tests" element={<ComingSoon title="Mock tests" />} />
                  <Route path="mentors" element={<ComingSoon title="Mentors" />} />
                  <Route path="community" element={<ComingSoon title="Community" />} />
                  <Route path="interviews" element={<ComingSoon title="Interview experiences" />} />
                  <Route path="resume" element={<ComingSoon title="Resume" />} />
                  <Route path="analytics" element={<ComingSoon title="Analytics" />} />
                  <Route path="achievements" element={<ComingSoon title="Achievements" />} />
                  <Route path="requests" element={<ComingSoon title="Mentor requests" />} />
                  <Route path="students" element={<ComingSoon title="Students" />} />
                  <Route path="sessions" element={<ComingSoon title="Sessions" />} />
                  <Route path="leaderboard" element={<ComingSoon title="Leaderboard" />} />
                  <Route path="profile" element={<ComingSoon title="Mentor profile" />} />
                  <Route path="users" element={<ComingSoon title="Users" />} />
                  <Route path="topics" element={<ComingSoon title="Topics" />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
