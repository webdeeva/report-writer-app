import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { useAuthStore } from './context/authStore';

// Layouts
import { DashboardLayout } from './components/dashboard';
import AuthLayout from './components/layouts/AuthLayout';

// No direct imports for report pages - all should use lazy loading

// Pages - Lazy loaded for better performance
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const UsagePage = lazy(() => import('./pages/dashboard/UsagePage'));
const PeoplePage = lazy(() => import('./pages/people/PeoplePage'));
const PersonFormPage = lazy(() => import('./pages/people/PersonFormPage'));
const YearlyReportPage = lazy(() => import('./pages/reports/YearlyReportPage'));
const LifeReportPage = lazy(() => import('./pages/reports/LifeReportPage'));
const RelationshipReportPage = lazy(() => import('./pages/reports/RelationshipReportPage'));
const FinancialReportPage = lazy(() => import('./pages/reports/FinancialReportPage'));
const SinglesReportPage = lazy(() => import('./pages/reports/SinglesReportPage'));
const ChildrensLifeReportPage = lazy(() => import('./pages/reports/ChildrensLifeReportPage')); // Using lazy loading like other report pages
const ReportHistoryPage = lazy(() => import('./pages/reports/ReportHistoryPage'));
const UserManagementPage = lazy(() => import('./pages/admin/UserManagementPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const UserSettingsPage = lazy(() => import('./pages/user/UserSettingsPage'));
const FormComponentsDemo = lazy(() => import('./pages/FormComponentsDemo'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Loading component for suspense fallback
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode | ((props: { user: { id: number; username: string; isAdmin: boolean; isPremium?: boolean } | null }) => React.ReactNode);
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (typeof children === 'function') {
    return <>{children({ user })}</>;
  }
  
  return <>{children}</>;
};

function App() {
  const { checkAuth } = useAuthStore();
  
  // Check authentication status on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
        
        {/* Form Components Demo - unprotected for easy access */}
        <Route path="/form-components-demo" element={<FormComponentsDemo />} />
        
        
        {/* Dashboard routes - protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          
          {/* People routes */}
          <Route path="people">
            <Route index element={<PeoplePage />} />
            <Route path="new" element={<PersonFormPage />} />
            <Route path=":id" element={<PersonFormPage />} />
          </Route>
          
          {/* Report routes */}
          <Route path="reports">
            <Route index element={<ReportHistoryPage />} />
            {/* IMPORTANT: Children's Life Report Route - UPDATED */}
            <Route path="childrens-life/:personId?" element={<ChildrensLifeReportPage />} />
            <Route path="yearly/:personId?" element={<YearlyReportPage />} />
            <Route path="life/:personId?" element={<LifeReportPage />} />
            <Route path="relationship" element={<RelationshipReportPage />} />
            <Route path="financial/:personId?" element={<FinancialReportPage />} />
            <Route path="singles/:personId?" element={<SinglesReportPage />} />
          </Route>
          
          {/* Usage route */}
          <Route path="usage" element={<UsagePage />} />
          
          {/* User settings route - protected for premium users */}
          <Route 
            path="settings" 
            element={
              <ProtectedRoute>
                {({ user }) => (
                  (user?.isPremium || user?.isAdmin) ? 
                    <UserSettingsPage /> : 
                    <Navigate to="/dashboard" replace />
                )}
              </ProtectedRoute>
            } 
          />
          
          {/* Admin routes */}
          <Route path="admin">
            <Route path="users" element={<UserManagementPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
        
        
        {/* DIRECT Children's Life Report Route - Added 11:33 AM */}
        <Route path="/dashboard/reports/childrens-life" element={
          <Suspense fallback={<Loading />}>
            <ChildrensLifeReportPage />
          </Suspense>
        } />
        
        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
