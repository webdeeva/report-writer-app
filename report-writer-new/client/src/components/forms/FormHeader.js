import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * FormHeader component
 *
 * This component displays the title and optional description at the top of a form.
 * It provides consistent styling and structure for all form headers.
 */
const FormHeader = ({ title, description, className = '' }) => {
    return (_jsxs("div", { className: `mb-6 ${className}`, children: [_jsx("h2", { className: "text-2xl font-bold text-gray-800", children: title }), description && (_jsx("div", { className: "mt-2 text-gray-600", children: typeof description === 'string' ? (_jsx("p", { children: description })) : (description) })), _jsx("div", { className: "mt-4 border-b border-gray-200" })] }));
};
export default FormHeader;
