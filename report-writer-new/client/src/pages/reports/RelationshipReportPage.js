import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormLayout, FormHeader, FormSection, FormField, FormFooter, PersonSelect } from '@/components/forms';
import { usePeople } from '@/hooks/usePeople';
import { useAuthStore } from '@/context/authStore';
import { getUserSettings } from '@/services/localStorageService';
const RelationshipReportPage = () => {
    const navigate = useNavigate();
    const { people } = usePeople();
    const { token } = useAuthStore();
    // Form state
    const [person1Id, setPerson1Id] = useState(null);
    const [person2Id, setPerson2Id] = useState(null);
    const [person1, setPerson1] = useState(null);
    const [person2, setPerson2] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [errors, setErrors] = useState({});
    // Handle person selection
    const handlePerson1Select = (id) => {
        setPerson1Id(id);
        if (id === null) {
            setPerson1(null);
            return;
        }
        const person = people.find(p => p.id === id);
        if (person) {
            setPerson1(person);
        }
    };
    const handlePerson2Select = (id) => {
        setPerson2Id(id);
        if (id === null) {
            setPerson2(null);
            return;
        }
        const person = people.find(p => p.id === id);
        if (person) {
            setPerson2(person);
        }
    };
    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (!person1Id) {
            newErrors.person1Id = 'Please select the first person';
        }
        if (!person2Id) {
            newErrors.person2Id = 'Please select the second person';
        }
        if (person1Id === person2Id && person1Id !== null) {
            newErrors.person2Id = 'Please select a different person';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // State for error message
    const [errorMessage, setErrorMessage] = useState(null);
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setGenerating(true);
        setErrorMessage(null);
        try {
            // Get user settings from localStorage
            const userSettings = getUserSettings();
            // Generate the relationship report
            const reportResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/relationship`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    person1Id,
                    person2Id,
                    // Include user settings
                    userSettings: {
                        logoPath: userSettings.logoPath,
                        footerText: userSettings.footerText
                    }
                }),
            });
            // Get the response text
            const responseText = await reportResponse.text();
            // Try to parse as JSON
            let responseData;
            try {
                responseData = JSON.parse(responseText);
            }
            catch (e) {
                // If not valid JSON, use the text as error message
                if (!reportResponse.ok) {
                    throw new Error(responseText || 'Failed to generate report');
                }
            }
            if (!reportResponse.ok) {
                // If we have a JSON response with an error message, use it
                if (responseData && responseData.message) {
                    throw new Error(responseData.message);
                }
                throw new Error('Failed to generate report');
            }
            // Navigate to the report history page or download the report
            navigate('/dashboard/reports');
        }
        catch (error) {
            console.error('Error generating report:', error);
            setErrorMessage(error.message || 'Failed to generate report. Please try again.');
        }
        finally {
            setGenerating(false);
        }
    };
    return (_jsx(FormLayout, { children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(FormHeader, { title: "Relationship Report", description: "Generate a detailed relationship analysis based on the birth cards of two people." }), _jsx(FormSection, { title: "People Information", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs(FormField, { label: "Person 1", required: true, error: errors.person1Id, children: [_jsx(PersonSelect, { value: person1Id, onChange: handlePerson1Select, placeholder: "Select first person", required: true }), person1 && (_jsxs("p", { className: "mt-2 text-sm text-gray-500", children: ["Birth Date: ", person1.originalDateFormat ||
                                                // Format without timezone conversion to avoid date shifting
                                                person1.birthdate.split('T')[0].split('-').reverse().join('/')] }))] }), _jsxs(FormField, { label: "Person 2", required: true, error: errors.person2Id, children: [_jsx(PersonSelect, { value: person2Id, onChange: handlePerson2Select, placeholder: "Select second person", required: true }), person2 && (_jsxs("p", { className: "mt-2 text-sm text-gray-500", children: ["Birth Date: ", person2.originalDateFormat ||
                                                // Format without timezone conversion to avoid date shifting
                                                person2.birthdate.split('T')[0].split('-').reverse().join('/')] }))] })] }) }), errorMessage && (_jsxs("div", { className: "mt-4 p-4 border border-red-300 bg-red-50 text-red-700 rounded-md", children: [_jsx("p", { className: "font-medium", children: "Error generating report:" }), _jsx("p", { children: errorMessage })] })), _jsx(FormFooter, { primaryButton: _jsx("button", { type: "submit", className: "px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed", disabled: generating || !person1Id || !person2Id, children: generating ? 'Generating...' : 'Generate Report' }), secondaryButton: _jsx("button", { type: "button", className: "px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2", onClick: () => navigate('/dashboard'), children: "Cancel" }) })] }) }));
};
export default RelationshipReportPage;
