import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FormExamples } from '../components/forms';
/**
 * FormComponentsDemo page
 *
 * This page demonstrates the form components in action.
 * It's a simple wrapper around the YearlyReportFormExample component.
 */
const FormComponentsDemo = () => {
    return (_jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Form Components Demo" }), _jsx("p", { className: "text-gray-600", children: "This page demonstrates the form components in action. Below is an example of a yearly report form that uses all the form components." })] }), _jsx("div", { className: "bg-white rounded-lg shadow-lg p-6", children: _jsx(FormExamples.YearlyReportFormExample, {}) })] }));
};
export default FormComponentsDemo;
