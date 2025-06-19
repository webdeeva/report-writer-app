import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/context/authStore';
/**
 * Layout for dashboard pages with navigation
 */
const DashboardLayout = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (_jsxs("div", { className: "min-h-screen flex flex-col bg-background-alt", children: [_jsx("header", { className: "bg-white shadow-sm", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("img", { src: "/assets/logo.png", alt: "Report Writer Logo", className: "h-10 mr-3 block", style: {
                                        display: 'block',
                                        visibility: 'visible',
                                        width: 'auto',
                                        maxWidth: '100%',
                                        opacity: 1,
                                        position: 'static'
                                    }, onError: (e) => {
                                        console.error('Logo failed to load in DashboardLayout');
                                        // Try alternative paths
                                        if (e.currentTarget.src.includes('/assets/logo.png')) {
                                            e.currentTarget.src = '/logo.png';
                                        }
                                        else {
                                            // If all paths fail, hide the image
                                            e.currentTarget.style.display = 'none';
                                        }
                                    }, onLoad: () => console.log('Logo loaded in DashboardLayout') }), _jsx("h1", { className: "text-2xl font-bold text-primary", children: import.meta.env.VITE_APP_NAME || 'Report Writer' })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("span", { className: "text-secondary", children: ["Welcome, ", user?.username || 'User'] }), _jsx("button", { onClick: handleLogout, className: "btn bg-primary text-white hover:bg-primary-light text-sm", children: "Logout" })] })] }) }), _jsxs("div", { className: "flex flex-1", children: [_jsx("aside", { className: "w-64 bg-white shadow-md", children: _jsx("nav", { className: "p-4", children: _jsxs("ul", { className: "space-y-2", children: [_jsx("li", { children: _jsx(NavLink, { to: "/dashboard", end: true, className: ({ isActive }) => `block p-2 rounded-md ${isActive
                                                ? 'bg-primary text-white'
                                                : 'text-secondary hover:bg-gray-100'}`, children: "Dashboard" }) }), _jsx("li", { children: _jsx(NavLink, { to: "/dashboard/people", className: ({ isActive }) => `block p-2 rounded-md ${isActive
                                                ? 'bg-primary text-white'
                                                : 'text-secondary hover:bg-gray-100'}`, children: "People" }) }), _jsx("li", { children: _jsx(NavLink, { to: "/dashboard/usage", className: ({ isActive }) => `block p-2 rounded-md ${isActive
                                                ? 'bg-primary text-white'
                                                : 'text-secondary hover:bg-gray-100'}`, children: "Usage & Billing" }) }), _jsxs("li", { className: "pt-2", children: [_jsx("h3", { className: "font-medium text-secondary-dark px-2 py-1", children: "Reports" }), _jsxs("ul", { className: "pl-2 space-y-1 mt-1", children: [_jsx("li", { children: _jsx(NavLink, { to: "/dashboard/reports/yearly", className: ({ isActive }) => `block p-2 rounded-md ${isActive
                                                                ? 'bg-primary text-white'
                                                                : 'text-secondary hover:bg-gray-100'}`, children: "Yearly Report" }) }), _jsx("li", { children: _jsx(NavLink, { to: "/dashboard/reports/life", className: ({ isActive }) => `block p-2 rounded-md ${isActive
                                                                ? 'bg-primary text-white'
                                                                : 'text-secondary hover:bg-gray-100'}`, children: "Life Report" }) }), _jsx("li", { children: _jsx(NavLink, { to: "/dashboard/reports/relationship", className: ({ isActive }) => `block p-2 rounded-md ${isActive
                                                                ? 'bg-primary text-white'
                                                                : 'text-secondary hover:bg-gray-100'}`, children: "Relationship Report" }) }), _jsx("li", { children: _jsx(NavLink, { to: "/dashboard/reports", className: ({ isActive }) => `block p-2 rounded-md ${isActive
                                                                ? 'bg-primary text-white'
                                                                : 'text-secondary hover:bg-gray-100'}`, children: "Report History" }) })] })] }), user?.isAdmin && (_jsxs("li", { className: "pt-2", children: [_jsx("h3", { className: "font-medium text-secondary-dark px-2 py-1", children: "Admin" }), _jsxs("ul", { className: "pl-2 space-y-1 mt-1", children: [_jsx("li", { children: _jsx(NavLink, { to: "/dashboard/admin/users", className: ({ isActive }) => `block p-2 rounded-md ${isActive
                                                                ? 'bg-primary text-white'
                                                                : 'text-secondary hover:bg-gray-100'}`, children: "User Management" }) }), _jsx("li", { children: _jsx(NavLink, { to: "/dashboard/admin/settings", className: ({ isActive }) => `block p-2 rounded-md ${isActive
                                                                ? 'bg-primary text-white'
                                                                : 'text-secondary hover:bg-gray-100'}`, children: "Settings" }) })] })] }))] }) }) }), _jsx("main", { className: "flex-1 p-6", children: _jsx(Outlet, {}) })] })] }));
};
export default DashboardLayout;
