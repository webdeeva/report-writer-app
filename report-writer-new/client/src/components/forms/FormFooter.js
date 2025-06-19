import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * FormFooter component
 *
 * This component provides a consistent footer for forms with primary, secondary,
 * and tertiary buttons. It can be sticky to the bottom of the form for better UX.
 */
const FormFooter = ({ primaryButton, secondaryButton, tertiaryButton, className = '', align = 'between', sticky = false }) => {
    const alignmentClasses = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
        between: 'justify-between'
    };
    return (_jsx("div", { className: `
        mt-8 pt-4 border-t border-gray-200
        ${sticky ? 'sticky bottom-0 bg-white py-4 px-6 -mx-6 -mb-6 shadow-md' : ''}
        ${className}
      `, children: _jsxs("div", { className: `flex flex-wrap items-center gap-3 ${alignmentClasses[align]}`, children: [align === 'between' && tertiaryButton && (_jsx("div", { className: "order-1", children: tertiaryButton })), align === 'between' ? (_jsxs("div", { className: "order-2 flex items-center gap-3", children: [secondaryButton, primaryButton] })) : (_jsxs(_Fragment, { children: [tertiaryButton && _jsx("div", { children: tertiaryButton }), secondaryButton && _jsx("div", { children: secondaryButton }), _jsx("div", { children: primaryButton })] }))] }) }));
};
export default FormFooter;
