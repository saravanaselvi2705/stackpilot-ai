import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LandingPage from './features/landing/LandingPage';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ForgotPassword from './features/auth/ForgotPassword';
import Dashboard from './features/dashboard/Dashboard';
import CRM from './features/crm/CRM';
import Projects from './features/projects/Projects';
import Tasks from './features/tasks/Tasks';
import Requirements from './features/requirements/Requirements';
import AIScripts from './features/ai/AIScripts';
import Documentation from './features/docs/Documentation';
import SEO from './features/seo/SEO';
import Team from './features/team/Team';
import Finance from './features/finance/Finance';
import TeamCalendar from './features/calendar/TeamCalendar';
import Settings from './features/settings/Settings';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Workspace Layout */}
          <Route 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/requirements" element={<Requirements />} />
            <Route path="/ai-studio" element={<AIScripts />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/seo" element={<SEO />} />
            <Route path="/team" element={<Team />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/calendar" element={<TeamCalendar />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Redirects */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;