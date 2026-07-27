import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CustomizationProvider, useCustomization } from './context/CustomizationContext';

// Lazy loading feature modules for optimized bundle sizes
const Layout = lazy(() => import('./components/Layout'));
const LandingPage = lazy(() => import('./features/landing/LandingPage'));
const Login = lazy(() => import('./features/auth/Login'));
const Register = lazy(() => import('./features/auth/Register'));
const ForgotPassword = lazy(() => import('./features/auth/ForgotPassword'));
const Dashboard = lazy(() => import('./features/dashboard/Dashboard'));
const CRM = lazy(() => import('./features/crm/CRM'));
const Projects = lazy(() => import('./features/projects/Projects'));
const Tasks = lazy(() => import('./features/tasks/Tasks'));
const AIScripts = lazy(() => import('./features/ai/AIScripts'));
const Documentation = lazy(() => import('./features/docs/Documentation'));
const SEO = lazy(() => import('./features/seo/SEO'));
const Team = lazy(() => import('./features/team/Team'));
const LeaveManagement = lazy(() => import('./features/team/LeaveManagement'));
const Finance = lazy(() => import('./features/finance/Finance'));
const TeamCalendar = lazy(() => import('./features/calendar/TeamCalendar'));
const Settings = lazy(() => import('./features/settings/Settings'));

const PageLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-[#22C55E]/20 border-t-[#22C55E] rounded-full animate-spin" />
      <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Loading Workspace...</span>
    </div>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
        <div className="w-12 h-12 border-4 border-[#22C55E]/20 border-t-[#22C55E] rounded-full animate-spin mb-4" />
        <span className="text-xs font-bold tracking-widest uppercase text-slate-400">Authenticating Session...</span>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Route-level permission guards checking dynamic permissions matrix
const GuardedRoute: React.FC<{ 
  children: React.ReactNode; 
  module: 'CRM' | 'PM' | 'Finance' | 'SEO' 
}> = ({ children, module }) => {
  const { hasPermission } = useCustomization();
  if (!hasPermission(module, 'view')) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CustomizationProvider>
          <Suspense fallback={<PageLoader />}>
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
                <Route path="/crm" element={
                  <GuardedRoute module="CRM">
                    <CRM />
                  </GuardedRoute>
                } />
                <Route path="/projects" element={
                  <GuardedRoute module="PM">
                    <Projects />
                  </GuardedRoute>
                } />
                <Route path="/tasks" element={
                  <GuardedRoute module="PM">
                    <Tasks />
                  </GuardedRoute>
                } />
                <Route path="/requirements" element={<Navigate to="/documentation?tab=requirements" replace />} />
                <Route path="/ai-studio" element={<AIScripts />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/reports" element={
                  <GuardedRoute module="SEO">
                    <SEO />
                  </GuardedRoute>
                } />
                <Route path="/seo" element={<Navigate to="/reports" replace />} />
                <Route path="/team" element={<Team />} />
                <Route path="/leave-requests" element={<LeaveManagement />} />
                <Route path="/finance" element={
                  <GuardedRoute module="Finance">
                    <Finance />
                  </GuardedRoute>
                } />
                <Route path="/calendar" element={<TeamCalendar />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* Redirects */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </CustomizationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;