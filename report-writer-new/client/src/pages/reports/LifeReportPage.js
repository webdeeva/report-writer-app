import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormLayout, FormHeader, FormSection, FormField, FormFooter, PersonSelect } from '@/components/forms';
import { usePeople } from '@/hooks/usePeople';
import { useAuthStore } from '@/context/authStore';
import { getUserSettings } from '@/services/localStorageService';
const LifeReportPage = () => {
    const { personId } = useParams();
    const navigate = useNavigate();
    const { people } = usePeople();
    const { token } = useAuthStore();
    // Form state
    const [selectedPersonId, setSelectedPersonId] = useState(null);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [errors, setErrors] = useState({});
    // Set selected person if personId is provided in URL
    useEffect(() => {
        if (personId && people.length > 0) {
            const parsedId = parseInt(personId);
            const person = people.find(p => p.id === parsedId);
            if (person) {
                handlePersonSelect(parsedId);
            }
        }
    }, [personId, people]);
    // Handle person selection
    const handlePersonSelect = (id) => {
        setSelectedPersonId(id);
        if (id === null) {
            setSelectedPerson(null);
            return;
        }
        const person = people.find(p => p.id === id);
        if (person) {
            setSelectedPerson(person);
        }
    };
    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (!selectedPersonId) {
            newErrors.personId = 'Please select a person';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setGenerating(true);
        try {
            // Get user settings from localStorage
            const userSettings = getUserSettings();
            // Generate the life report
            const reportResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/life`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    personId: selectedPersonId,
                    originalDateFormat: selectedPerson?.originalDateFormat,
                    // Include user settings
                    userSettings: {
                        logoPath: userSettings.logoPath,
                        footerText: userSettings.footerText
                    }
                }),
            });
            if (!reportResponse.ok) {
                throw new Error('Failed to generate report');
            }
            const reportData = await reportResponse.json();
            // Navigate to the report history page or download the report
            navigate('/dashboard/reports');
        }
        catch (error) {
            console.error('Error generating report:', error);
            alert('Failed to generate report. Please try again.');
        }
        finally {
            setGenerating(false);
        }
    };
    return (_jsx(FormLayout, { children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(FormHeader, { title: "Life Report", description: "Generate a comprehensive life analysis based on the person's birth card and life spread." }), _jsxs(FormSection, { title: "Person Information", children: [_jsx(FormField, { label: "Select Person", required: true, error: errors.personId, children: _jsx(PersonSelect, { value: selectedPersonId, onChange: handlePersonSelect, placeholder: "Select a person", required: true }) }), selectedPerson && (_jsx(FormField, { label: "Birth Date", children: _jsx("p", { className: "text-gray-700", children: selectedPerson.originalDateFormat ||
                                    // Format without timezone conversion to avoid date shifting
                                    selectedPerson.birthdate.split('T')[0].split('-').reverse().join('/') }) }))] }), _jsx(FormFooter, { primaryButton: _jsx("button", { type: "submit", className: "px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed", disabled: generating || !selectedPersonId, children: generating ? 'Generating...' : 'Generate Report' }), secondaryButton: _jsx("button", { type: "button", className: "px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2", onClick: () => navigate('/dashboard'), children: "Cancel" }) })] }) }));
};
export default LifeReportPage;
