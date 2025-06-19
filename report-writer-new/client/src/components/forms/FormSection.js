import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
/**
 * FormSection component
 *
 * This component provides a section within a form with a title, optional description,
 * and content. It can be collapsible for better organization of complex forms.
 */
const FormSection = ({ title, description, children, className = '', defaultOpen = true, collapsible = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const toggleSection = () => {
        if (collapsible) {
            setIsOpen(!isOpen);
        }
    };
    return (_jsxs("div", { className: `mb-8 ${className}`, children: [_jsxs("div", { className: `flex items-center ${collapsible ? 'cursor-pointer' : ''}`, onClick: toggleSection, children: [_jsx("h3", { className: "text-lg font-semibold text-gray-700", children: title }), collapsible && (_jsx("button", { type: "button", className: "ml-auto text-gray-500 focus:outline-none", "aria-expanded": isOpen, "aria-label": isOpen ? 'Collapse section' : 'Expand section', children: _jsx("svg", { className: `w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7" }) }) }))] }), description && (_jsx("div", { className: "mt-1 text-sm text-gray-500", children: typeof description === 'string' ? (_jsx("p", { children: description })) : (description) })), (!collapsible || isOpen) && (_jsx("div", { className: "mt-4 space-y-4", children: children }))] }));
};
export default FormSection;
