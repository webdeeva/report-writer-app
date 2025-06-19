import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
/**
 * FormField component
 *
 * This component provides a consistent layout for form fields, including
 * label, input element, error message, and optional help text.
 */
const FormField = ({ label, htmlFor, error, required = false, className = '', children, helpText }) => {
    const id = htmlFor || Math.random().toString(36).substring(2, 9);
    const errorId = `${id}-error`;
    const helpTextId = `${id}-help`;
    return (_jsxs("div", { className: `mb-4 ${className}`, children: [_jsx("div", { className: "flex justify-between items-baseline mb-1", children: _jsxs("label", { htmlFor: id, className: "block text-sm font-medium text-gray-700", children: [label, required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] }) }), _jsx("div", { className: "mt-1", children: React.isValidElement(children)
                    ? React.cloneElement(children, {
                        id,
                        'aria-invalid': error ? 'true' : 'false',
                        'aria-describedby': error
                            ? errorId
                            : helpText
                                ? helpTextId
                                : undefined,
                    })
                    : children }), helpText && !error && (_jsx("p", { id: helpTextId, className: "mt-1 text-sm text-gray-500", children: helpText })), error && (_jsx("p", { id: errorId, className: "mt-1 text-sm text-red-600", role: "alert", children: error }))] }));
};
export default FormField;
