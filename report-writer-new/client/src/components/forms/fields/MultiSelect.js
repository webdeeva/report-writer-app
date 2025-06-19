import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
/**
 * MultiSelect component
 *
 * A component for selecting multiple options from a list.
 * It displays selected options as tags and provides a dropdown for selecting more options.
 */
const MultiSelect = ({ options, value, onChange, id, placeholder = 'Select options', disabled = false, className = '', 'aria-invalid': ariaInvalid, 'aria-describedby': ariaDescribedby }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);
    const selectId = id || `multiselect-${Math.random().toString(36).substring(2, 9)}`;
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    // Filter options based on search term and already selected values
    const filteredOptions = options.filter(option => !value.includes(option.value) &&
        option.label.toLowerCase().includes(searchTerm.toLowerCase()));
    // Get selected options with labels
    const selectedOptions = options.filter(option => value.includes(option.value));
    // Toggle option selection
    const toggleOption = (optionValue) => {
        if (value.includes(optionValue)) {
            onChange(value.filter(v => v !== optionValue));
        }
        else {
            onChange([...value, optionValue]);
        }
    };
    // Remove a selected option
    const removeOption = (optionValue) => {
        onChange(value.filter(v => v !== optionValue));
    };
    return (_jsxs("div", { className: `relative ${className}`, ref: dropdownRef, children: [_jsxs("div", { className: `
          flex flex-wrap items-center w-full px-3 py-2 text-base
          border rounded-md shadow-sm min-h-[42px] focus-within:ring-1
          ${ariaInvalid === true || ariaInvalid === 'true'
                    ? 'border-red-300 focus-within:ring-red-500 focus-within:border-red-500'
                    : 'border-gray-300 focus-within:ring-indigo-500 focus-within:border-indigo-500'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer'}
        `, onClick: () => !disabled && setIsOpen(true), children: [selectedOptions.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1 mr-2", children: selectedOptions.map(option => (_jsxs("div", { className: "flex items-center bg-indigo-100 text-indigo-800 text-sm rounded-md px-2 py-1", children: [_jsx("span", { children: option.label }), !disabled && (_jsx("button", { type: "button", className: "ml-1 text-indigo-500 hover:text-indigo-700 focus:outline-none", onClick: (e) => {
                                        e.stopPropagation();
                                        removeOption(option.value);
                                    }, "aria-label": `Remove ${option.label}`, children: _jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }) }) }))] }, option.value))) })), isOpen ? (_jsx("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: selectedOptions.length === 0 ? placeholder : '', className: "flex-grow border-none focus:outline-none focus:ring-0 p-0 min-w-[80px]", onClick: (e) => e.stopPropagation(), onKeyDown: (e) => {
                            if (e.key === 'Escape') {
                                setIsOpen(false);
                            }
                        }, autoFocus: true })) : (selectedOptions.length === 0 && (_jsx("span", { className: "text-gray-500", children: placeholder }))), _jsx("div", { className: "ml-auto pl-2", children: _jsx("svg", { className: `w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7" }) }) })] }), isOpen && (_jsx("div", { className: "absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto", children: filteredOptions.length === 0 ? (_jsx("div", { className: "px-4 py-2 text-sm text-gray-500", children: searchTerm ? 'No matching options found' : 'No options available' })) : (_jsx("ul", { className: "py-1", children: filteredOptions.map(option => (_jsx("li", { className: "px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 text-gray-900", onClick: () => {
                            toggleOption(option.value);
                            setSearchTerm('');
                        }, children: option.label }, option.value))) })) }))] }));
};
export default MultiSelect;
