import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { FormLayout, FormHeader, FormSection, FormField, FormFooter, PersonSelect, OptionCheckbox, MultiSelect, PromptTextarea, TextDateInput } from '../';
/**
 * YearlyReportFormExample component
 *
 * This is an example component that demonstrates how to use the form components.
 * It creates a form for generating a yearly report.
 */
const YearlyReportFormExample = () => {
    // Form state
    const [personId, setPersonId] = useState(null);
    const [customDate, setCustomDate] = useState('');
    const [includeAstrology, setIncludeAstrology] = useState(true);
    const [includeTarot, setIncludeTarot] = useState(true);
    const [includeNumerology, setIncludeNumerology] = useState(true);
    const [selectedAspects, setSelectedAspects] = useState([]);
    const [prompt, setPrompt] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    // Example aspects for MultiSelect
    const aspectOptions = [
        { value: 'career', label: 'Career & Work' },
        { value: 'relationships', label: 'Relationships' },
        { value: 'health', label: 'Health & Wellness' },
        { value: 'finances', label: 'Finances' },
        { value: 'personal', label: 'Personal Growth' },
        { value: 'spirituality', label: 'Spirituality' },
        { value: 'creativity', label: 'Creativity' },
        { value: 'travel', label: 'Travel & Adventure' }
    ];
    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (!personId) {
            newErrors.personId = 'Please select a person';
        }
        if (selectedAspects.length === 0) {
            newErrors.aspects = 'Please select at least one aspect';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            console.log('Form submitted with:', {
                personId,
                customDate,
                includeAstrology,
                includeTarot,
                includeNumerology,
                selectedAspects,
                prompt
            });
            setIsSubmitting(false);
            // Show success message or redirect
            alert('Report generated successfully!');
        }, 1500);
    };
    return (_jsx(FormLayout, { children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(FormHeader, { title: "Generate Yearly Report", description: "Create a personalized yearly analysis report based on playing cards, astrology, and numerology." }), _jsxs(FormSection, { title: "Person Information", children: [_jsx(FormField, { label: "Select Person", required: true, error: errors.personId, children: _jsx(PersonSelect, { value: personId, onChange: setPersonId, placeholder: "Select a person", required: true }) }), _jsx(FormField, { label: "Custom Date (Optional)", helpText: "Leave blank to use today's date", children: _jsx(TextDateInput, { value: customDate, onChange: setCustomDate, placeholder: "MM/DD/YYYY" }) })] }), _jsx(FormSection, { title: "Report Options", collapsible: true, children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(FormField, { label: "Include Astrology", children: _jsx(OptionCheckbox, { label: "Include Astrology", checked: includeAstrology, onChange: setIncludeAstrology, description: "Add astrological insights to the report" }) }), _jsx(FormField, { label: "Include Tarot", children: _jsx(OptionCheckbox, { label: "Include Tarot", checked: includeTarot, onChange: setIncludeTarot, description: "Add tarot card interpretations to the report" }) }), _jsx(FormField, { label: "Include Numerology", children: _jsx(OptionCheckbox, { label: "Include Numerology", checked: includeNumerology, onChange: setIncludeNumerology, description: "Add numerological insights to the report" }) })] }) }), _jsxs(FormSection, { title: "Report Focus", children: [_jsx(FormField, { label: "Select Aspects to Focus On", required: true, error: errors.aspects, children: _jsx(MultiSelect, { options: aspectOptions, value: selectedAspects, onChange: setSelectedAspects, placeholder: "Select aspects to focus on" }) }), _jsx(FormField, { label: "Custom Prompt (Optional)", helpText: "Add specific questions or areas you'd like the report to address", children: _jsx(PromptTextarea, { value: prompt, onChange: setPrompt, placeholder: "Enter any specific questions or areas you'd like the report to address...", maxLength: 1000 }) })] }), _jsx(FormFooter, { primaryButton: _jsx("button", { type: "submit", className: "px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed", disabled: isSubmitting, children: isSubmitting ? 'Generating...' : 'Generate Report' }), secondaryButton: _jsx("button", { type: "button", className: "px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2", onClick: () => window.history.back(), children: "Cancel" }) })] }) }));
};
export default YearlyReportFormExample;
