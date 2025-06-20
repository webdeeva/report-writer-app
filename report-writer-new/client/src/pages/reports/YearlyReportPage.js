import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { calculateAge } from '@/utils/dateUtils';
import { FormLayout, FormHeader, FormSection, FormField, FormFooter, PersonSelect } from '@/components/forms';
import { usePeople } from '@/hooks/usePeople';
import { useAuthStore } from '@/context/authStore';
import { getUserSettings } from '@/services/localStorageService';
const YearlyReportPage = () => {
    const { personId } = useParams();
    const navigate = useNavigate();
    const { people, loading: peopleLoading } = usePeople();
    const { token } = useAuthStore();
    // Form state
    const [selectedPersonId, setSelectedPersonId] = useState(null);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [calculatedAge, setCalculatedAge] = useState(null);
    const [customAge, setCustomAge] = useState('');
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
            setCalculatedAge(null);
            return;
        }
        const person = people.find(p => p.id === id);
        if (person) {
            setSelectedPerson(person);
            const age = calculateAge(person.birthdate);
            setCalculatedAge(age);
        }
    };
    // Handle custom age change
    const handleCustomAgeChange = (e) => {
        setCustomAge(e.target.value);
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
        // Get user settings from localStorage
        const userSettings = getUserSettings();
        // Navigate to reports page immediately with generating state
        navigate('/dashboard/reports', { 
            state: { 
                generating: true, 
                personName: selectedPerson?.name,
                reportType: 'yearly' 
            } 
        });
        // Generate the report in the background
        fetch(`${import.meta.env.VITE_API_URL}/api/reports/yearly`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                personId: selectedPersonId,
                customAge: customAge ? parseInt(customAge) : undefined,
                originalDateFormat: selectedPerson?.originalDateFormat,
                // Include user settings
                userSettings: {
                    logoPath: userSettings.logoPath,
                    footerText: userSettings.footerText
                }
            }),
        }).then(async (response) => {
            if (!response.ok) {
                let errorMessage = 'Failed to generate report';
                try {
                    const errorText = await response.text();
                    // Check if it's an HTML error page (like 502 Bad Gateway)
                    if (errorText.includes('<html>') || errorText.includes('502 Bad Gateway')) {
                        errorMessage = 'Server is temporarily unavailable. Please try again in a few moments.';
                    } else if (errorText.includes('503')) {
                        errorMessage = 'Service is temporarily overloaded. Please try again later.';
                    } else if (errorText.includes('timeout')) {
                        errorMessage = 'Report generation timed out. This can happen with complex reports. Please try again.';
                    } else if (errorText) {
                        // Try to parse JSON error response
                        try {
                            const errorJson = JSON.parse(errorText);
                            errorMessage = errorJson.error || errorJson.message || errorText;
                        } catch {
                            errorMessage = errorText;
                        }
                    }
                } catch (e) {
                    console.error('Error parsing error response:', e);
                }
                throw new Error(errorMessage);
            }
            return response.json();
        }).catch((error) => {
            console.error('Error generating report:', error);
            let userFriendlyError = error.message;
            
            // Handle network errors
            if (error.message === 'Failed to fetch') {
                userFriendlyError = 'Unable to connect to the server. Please check your internet connection and try again.';
            }
            
            // Navigate back with error state
            navigate('/dashboard/reports', { 
                state: { 
                    generating: false, 
                    error: userFriendlyError
                } 
            });
        });
    };
    return (_jsx(FormLayout, { children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(FormHeader, { title: "Yearly Report", description: "Generate a detailed yearly analysis based on the person's birth card and yearly spread." }), _jsxs(FormSection, { title: "Person Information", children: [_jsx(FormField, { label: "Select Person", required: true, error: errors.personId, children: _jsx(PersonSelect, { value: selectedPersonId, onChange: handlePersonSelect, placeholder: "Select a person", required: true }) }), selectedPerson && (_jsxs(_Fragment, { children: [_jsx(FormField, { label: "Birth Date", children: _jsx("p", { className: "text-gray-700", children: selectedPerson.originalDateFormat ||
                                            // Format without timezone conversion to avoid date shifting
                                            selectedPerson.birthdate.split('T')[0].split('-').reverse().join('/') }) }), _jsx(FormField, { label: "Calculated Age", children: _jsx("p", { className: "text-gray-700", children: calculatedAge }) }), _jsx(FormField, { label: "Custom Age (Optional)", helpText: "Use this to generate a report for a different age than the calculated one.", children: _jsx("input", { type: "number", min: "1", max: "100", value: customAge, onChange: handleCustomAgeChange, className: "form-input", placeholder: "Enter custom age" }) })] }))] }), _jsx(FormFooter, { primaryButton: _jsx("button", { type: "submit", className: "px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed", disabled: generating || !selectedPersonId, children: generating ? 'Generating...' : 'Generate Report' }), secondaryButton: _jsx("button", { type: "button", className: "px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2", onClick: () => navigate('/dashboard'), children: "Cancel" }) })] }) }));
};
export default YearlyReportPage;
