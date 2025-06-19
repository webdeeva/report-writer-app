import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
/**
 * TopNavBar component for the dashboard layout
 *
 * This component displays the top navigation bar with logo, user menu,
 * notifications icon, and help button.
 */
const TopNavBar = ({ onMenuToggle }) => {
    const { user, logout } = useAuthStore();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [logoSrc, setLogoSrc] = useState('/logo.png');
    // Try different paths for the logo if the default one fails
    const handleLogoError = () => {
        console.error('Logo failed to load from', logoSrc);
        if (logoSrc === '/logo.png') {
            setLogoSrc('/assets/logo.png');
        }
        else if (logoSrc === '/assets/logo.png') {
            setLogoSrc('../logo.png');
        }
        else if (logoSrc === '../logo.png') {
            setLogoSrc('../../logo.png');
        }
        else if (logoSrc === '../../logo.png') {
            setLogoSrc('../../../logo.png');
        }
        else {
            console.error('Could not load logo from any path');
            // Use an inline SVG as fallback
            setLogoSrc('');
        }
    };
    const toggleUserMenu = () => {
        setUserMenuOpen(!userMenuOpen);
    };
    const handleLogout = () => {
        logout();
    };
    return (_jsx("nav", { className: "bg-white border-b border-gray-200 fixed z-30 w-full", children: _jsx("div", { className: "px-3 py-3 lg:px-5 lg:pl-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center justify-start", children: [_jsxs("button", { type: "button", onClick: onMenuToggle, className: "inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200", "aria-controls": "mobile-menu", "aria-expanded": "false", children: [_jsx("span", { className: "sr-only", children: "Open main menu" }), _jsx("svg", { className: "w-6 h-6", fill: "currentColor", viewBox: "0 0 20 20", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { fillRule: "evenodd", d: "M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z", clipRule: "evenodd" }) })] }), _jsxs(Link, { to: "/dashboard", className: "flex ml-2 md:mr-24 items-center", children: [logoSrc ? (_jsx("img", { src: logoSrc, alt: "Report Writer Logo", className: "h-8 mr-2 block", style: {
                                            display: 'block',
                                            visibility: 'visible',
                                            width: 'auto',
                                            maxWidth: '100%'
                                        }, onError: handleLogoError, onLoad: () => console.log('Logo loaded in TopNavBar from', logoSrc) })) : (
                                    // Fallback SVG logo
                                    _jsxs("svg", { className: "h-8 w-8 mr-2", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), _jsx("polyline", { points: "14 2 14 8 20 8" }), _jsx("line", { x1: "16", y1: "13", x2: "8", y2: "13" }), _jsx("line", { x1: "16", y1: "17", x2: "8", y2: "17" }), _jsx("polyline", { points: "10 9 9 9 8 9" })] })), _jsx("span", { className: "self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-primary", children: "Report Writer" })] })] }), _jsxs("div", { className: "flex items-center", children: [_jsxs("button", { type: "button", className: "p-2 mr-3 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200", children: [_jsx("span", { className: "sr-only", children: "View notifications" }), _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" }) })] }), _jsxs("button", { type: "button", className: "p-2 mr-3 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200", children: [_jsx("span", { className: "sr-only", children: "Get help" }), _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) })] }), _jsxs("div", { className: "relative", children: [_jsxs("button", { type: "button", onClick: toggleUserMenu, className: "flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300", id: "user-menu-button", "aria-expanded": userMenuOpen, "aria-haspopup": "true", children: [_jsx("span", { className: "sr-only", children: "Open user menu" }), _jsx("div", { className: "w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white", children: user?.username?.charAt(0) || 'U' })] }), userMenuOpen && (_jsxs("div", { className: "absolute right-0 z-50 my-2 text-base list-none bg-white divide-y divide-gray-100 rounded shadow", id: "user-dropdown", children: [_jsxs("div", { className: "px-4 py-3", children: [_jsx("span", { className: "block text-sm text-gray-900", children: user?.username || 'User' }), _jsx("span", { className: "block text-sm font-medium text-gray-500 truncate", children: "User Account" })] }), _jsxs("ul", { className: "py-1", "aria-labelledby": "user-menu-button", children: [_jsx("li", { children: _jsx(Link, { to: "/dashboard/settings", className: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", onClick: () => setUserMenuOpen(false), children: "Settings" }) }), _jsx("li", { children: _jsx("button", { onClick: handleLogout, className: "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", children: "Sign out" }) })] })] }))] })] })] }) }) }));
};
export default TopNavBar;
