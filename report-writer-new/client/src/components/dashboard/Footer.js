import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
/**
 * Footer component for the dashboard layout
 *
 * This component displays the footer with copyright information,
 * version number, and links to terms of service, privacy policy, etc.
 */
const Footer = () => {
    const currentYear = new Date().getFullYear();
    const appVersion = '1.0.0'; // This could be imported from a config file
    return (_jsxs("footer", { className: "bg-white p-4 shadow md:flex md:items-center md:justify-between md:p-6 border-t border-gray-200", children: [_jsxs("div", { className: "text-sm text-gray-500 sm:text-center", children: [_jsxs("span", { children: ["\u00A9 ", currentYear, " "] }), _jsx("span", { className: "font-semibold", children: "Report Writer" }), _jsx("span", { children: ". All Rights Reserved." })] }), _jsx("div", { className: "flex flex-wrap items-center mt-3 text-sm text-gray-500 sm:mt-0", children: _jsx("div", { children: _jsxs("span", { children: ["Version ", appVersion] }) }) })] }));
};
export default Footer;
