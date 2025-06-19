import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { useAuthStore } from './context/authStore';
// Layouts
import { DashboardLayout } from './components/dashboard';
import AuthLayout from './components/layouts/AuthLayout';
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
const ChildrensLifeReportPage = lazy(() => import('./pages/reports/ChildrensLifeReportPage'));
const ReportHistoryPage = lazy(() => import('./pages/reports/ReportHistoryPage'));
const UserManagementPage = lazy(() => import('./pages/admin/UserManagementPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const UserSettingsPage = lazy(() => import('./pages/user/UserSettingsPage'));
const FormComponentsDemo = lazy(() => import('./pages/FormComponentsDemo'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
// Loading component for suspense fallback
const Loading = () => (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" }) }));
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (typeof children === 'function') {
        return _jsx(_Fragment, { children: children({ user }) });
    }
    return _jsx(_Fragment, { children: children });
};
function App() {
    const { checkAuth } = useAuthStore();
    // Check authentication status on app load
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);
    return (_jsx(Suspense, { fallback: _jsx(Loading, {}), children: _jsxs(Routes, { children: [_jsxs(Route, { path: "/", element: _jsx(AuthLayout, {}), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/login", replace: true }) }), _jsx(Route, { path: "login", element: _jsx(LoginPage, {}) })] }), _jsx(Route, { path: "/form-components-demo", element: _jsx(FormComponentsDemo, {}) }), _jsxs(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(DashboardLayout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(DashboardPage, {}) }), _jsxs(Route, { path: "people", children: [_jsx(Route, { index: true, element: _jsx(PeoplePage, {}) }), _jsx(Route, { path: "new", element: _jsx(PersonFormPage, {}) }), _jsx(Route, { path: ":id", element: _jsx(PersonFormPage, {}) })] }), _jsxs(Route, { path: "reports", children: [_jsx(Route, { index: true, element: _jsx(ReportHistoryPage, {}) }), _jsx(Route, { path: "yearly/:personId?", element: _jsx(YearlyReportPage, {}) }), _jsx(Route, { path: "life/:personId?", element: _jsx(LifeReportPage, {}) }), _jsx(Route, { path: "relationship", element: _jsx(RelationshipReportPage, {}) }), _jsx(Route, { path: "financial/:personId?", element: _jsx(FinancialReportPage, {}) }), _jsx(Route, { path: "singles/:personId?", element: _jsx(SinglesReportPage, {}) }), _jsx(Route, { path: "childrens-life/:personId?", element: _jsx(ChildrensLifeReportPage, {}) })] }), _jsx(Route, { path: "usage", element: _jsx(UsagePage, {}) }), _jsx(Route, { path: "settings", element: _jsx(ProtectedRoute, { children: ({ user }) => ((user?.isPremium || user?.isAdmin) ?
                                    _jsx(UserSettingsPage, {}) :
                                    _jsx(Navigate, { to: "/dashboard", replace: true })) }) }), _jsxs(Route, { path: "admin", children: [_jsx(Route, { path: "users", element: _jsx(UserManagementPage, {}) }), _jsx(Route, { path: "settings", element: _jsx(SettingsPage, {}) })] })] }), _jsx(Route, { path: "/dashboard/reports/singles", element: _jsx(SinglesReportPage, {}) }), _jsx(Route, { path: "/dashboard/reports/singles", element: _jsx(SinglesReportPage, {}) }), _jsx(Route, { path: "*", element: _jsx(NotFoundPage, {}) })] }) }));
}
export default App;
