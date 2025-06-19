import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopNavBar from './TopNavBar';
import Sidebar from './Sidebar';
import Footer from './Footer';
/**
 * DashboardLayout component
 *
 * This component provides the layout structure for the dashboard,
 * including the top navigation bar, sidebar, main content area, and footer.
 */
const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // Ensure logo is loaded properly
    useEffect(() => {
        // Preload the logo image
        const img = new Image();
        img.src = '/assets/logo.png';
        img.onload = () => console.log('Logo loaded successfully from /assets/logo.png');
        img.onerror = () => {
            console.error('Error loading logo from /assets/logo.png, trying fallback');
            const fallbackImg = new Image();
            fallbackImg.src = '/logo.png';
            fallbackImg.onload = () => console.log('Logo loaded successfully from fallback /logo.png');
            fallbackImg.onerror = () => console.error('Error loading logo from fallback path');
        };
    }, []);
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    const closeSidebar = () => {
        setSidebarOpen(false);
    };
    return (_jsxs("div", { className: "flex h-screen bg-gray-50", children: [_jsx(TopNavBar, { onMenuToggle: toggleSidebar }), _jsx(Sidebar, { isOpen: sidebarOpen, onClose: closeSidebar }), _jsxs("div", { className: "flex flex-col flex-1 w-full pt-16 md:pl-64", children: [_jsx("main", { className: "flex-grow p-4 md:p-6 overflow-y-auto", children: _jsx(Outlet, {}) }), _jsx(Footer, {})] })] }));
};
export default DashboardLayout;
