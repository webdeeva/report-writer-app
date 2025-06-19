import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * OptionCheckbox component
 *
 * A styled checkbox component for selecting report options.
 * It includes a label and optional description.
 */
const OptionCheckbox = ({ id, label, description, checked, onChange, disabled = false, className = '', 'aria-invalid': ariaInvalid, 'aria-describedby': ariaDescribedby }) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;
    const handleChange = (e) => {
        onChange(e.target.checked);
    };
    return (_jsxs("div", { className: `relative flex items-start ${className}`, children: [_jsx("div", { className: "flex items-center h-5", children: _jsx("input", { id: checkboxId, type: "checkbox", checked: checked, onChange: handleChange, disabled: disabled, className: `
            h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500
            ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
            ${ariaInvalid === true || ariaInvalid === 'true' ? 'border-red-300' : ''}
          `, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedby }) }), _jsxs("div", { className: "ml-3 text-sm", children: [_jsx("label", { htmlFor: checkboxId, className: `font-medium text-gray-700 ${disabled ? 'opacity-60' : ''} ${!description ? 'cursor-pointer' : ''}`, children: label }), description && (_jsx("p", { className: "text-gray-500", children: description }))] })] }));
};
export default OptionCheckbox;
