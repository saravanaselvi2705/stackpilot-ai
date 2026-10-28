import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CustomizationProvider, useCustomization } from './context/CustomizationContext';

// Lazy loading feature modules
const Layout = lazy(() => import('./components/Layout'));
const LandingPage = lazy(() => import('./features/landing/LandingPage'));
const PrivacyPolicy = lazy(() => import('./features/landing/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./features/landing/TermsOfService'));
const SecurityCenter = lazy(() => import('./features/landing/SecurityCenter'));
const Login = lazy(() => import('./features/auth/Login'));
const Register = lazy(() => import('./features/auth/Register'));
const ForgotPassword = lazy(() => import('./features/auth/ForgotPassword'));
const Dashboard = lazy(() => import('./features/dashboard/Dashboard'));
const MyWork = lazy(() => import('./features/mywork/MyWork'));
const Notifications = lazy(() => import('./features/notifications/Notifications'));
const CRM = lazy(() => import('./features/crm/CRM'));
const Projects = lazy(() => import('./features/projects/Projects'));
const Tasks = lazy(() => import('./features/tasks/Tasks'));
const Documents = lazy(() => import('./features/documents/Documents'));
const Approvals = lazy(() => import('./features/approvals/Approvals'));
const Workflows = lazy(() => import('./features/workflows/Workflows'));
const AuditLogs = lazy(() => import('./features/audit/AuditLogs'));
const ReportsHub = lazy(() => import('./features/reports/ReportsHub'));
const SystemHealth = lazy(() => import('./features/system/SystemHealth'));
const Organization = lazy(() => import('./features/organization/Organization'));
const Contracts = lazy(() => import('./features/contracts/Contracts'));
const Timesheets = lazy(() => import('./features/timesheets/Timesheets'));
const AIScripts = lazy(() => import('./features/ai/AIScripts'));
const Team = lazy(() => import('./features/team/Team'));
const LeaveManagement = lazy(() => import('./features/team/LeaveManagement'));
const Finance = lazy(() => import('./features/finance/Finance'));
const TeamCalendar = lazy(() => import('./features/calendar/TeamCalendar'));
const Settings = lazy(() => import('./features/settings/Settings'));

const PageLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Loading Business OS...</span>
    </div>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
        <span className="text-xs font-bold tracking-widest uppercase text-slate-400">Authenticating Session...</span>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

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
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/security" element={<SecurityCenter />} />

              {/* Protected Workspace Layout */}
              <Route 
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/my-work" element={<MyWork />} />
                <Route path="/notifications" element={<Notifications />} />
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
                <Route path="/documents" element={<Documents />} />
                <Route path="/approvals" element={<Approvals />} />
                <Route path="/workflows" element={<Workflows />} />
                <Route path="/audit-logs" element={<AuditLogs />} />
                <Route path="/reports" element={<ReportsHub />} />
                <Route path="/seo" element={<Navigate to="/reports" replace />} />
                <Route path="/system-health" element={<SystemHealth />} />
                <Route path="/organization" element={<Organization />} />
                <Route path="/contracts" element={<Contracts />} />
                <Route path="/timesheets" element={<Timesheets />} />
                <Route path="/ai-studio" element={<AIScripts />} />
                <Route path="/ai-assistant" element={<AIScripts />} />
                <Route path="/ai-reports" element={<AIScripts />} />
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