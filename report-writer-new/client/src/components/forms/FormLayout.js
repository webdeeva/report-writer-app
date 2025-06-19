import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * FormLayout component
 *
 * This component provides the base layout structure for all forms in the application.
 * It supports an optional preview panel that can be shown alongside the form.
 */
const FormLayout = ({ children, className = '', showPreview = false, preview }) => {
    return (_jsx("div", { className: `w-full ${className}`, children: _jsxs("div", { className: `flex flex-col lg:flex-row ${showPreview ? 'lg:space-x-6' : ''}`, children: [_jsx("div", { className: `flex-1 bg-white rounded-lg shadow-md p-6 ${showPreview ? 'lg:w-3/5' : 'w-full'}`, children: children }), showPreview && preview && (_jsxs("div", { className: "lg:w-2/5 mt-6 lg:mt-0 bg-white rounded-lg shadow-md p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-700", children: "Preview" }), _jsx("div", { className: "preview-content", children: preview })] }))] }) }));
};
export default FormLayout;
