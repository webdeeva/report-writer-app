import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePeople } from '@/hooks/usePeople';
import { FormLayout, FormHeader, FormSection, FormField, FormFooter } from '@/components/forms';
const PersonFormPage = () => {
    const { id } = useParams();
    const isEditing = Boolean(id);
    const navigate = useNavigate();
    const { people, loading: peopleLoading, addPerson, updatePerson, fetchPeople } = usePeople();
    const [formData, setFormData] = useState({
        name: '',
        birthdate: '',
        originalDateFormat: '' // Store the original date format
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    // Direct string manipulation for date conversion
    const formatDateForDisplay = (dateStr) => {
        // If already in MM/DD/YYYY format, return as is
        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
            return dateStr;
        }
        // For YYYY-MM-DD format
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            const [year, month, day] = dateStr.split('-');
            return `${month}/${day}/${year}`;
        }
        return dateStr;
    };
    // Direct string manipulation for date conversion
    const formatDateForStorage = (dateStr) => {
        // If already in YYYY-MM-DD format, return as is
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return dateStr;
        }
        // Convert MM/DD/YYYY to YYYY-MM-DD
        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
            const [month, day, year] = dateStr.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return dateStr;
    };
    // Fetch person data if editing
    useEffect(() => {
        if (isEditing && id && people.length > 0) {
            const personId = parseInt(id);
            const person = people.find(p => p.id === personId);
            if (person) {
                // Use the original date format if available, otherwise format from ISO
                const formattedBirthdate = person.originalDateFormat ||
                    (person.birthdate ? formatDateForDisplay(person.birthdate) : '');
                setFormData({
                    name: person.name,
                    birthdate: formattedBirthdate,
                    originalDateFormat: person.originalDateFormat || formattedBirthdate
                });
            }
        }
    }, [isEditing, id, people]);
    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.birthdate) {
            newErrors.birthdate = 'Birth date is required';
        }
        else {
            // For MM/DD/YYYY format
            const mmDdYyyyRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
            // For YYYY-MM-DD format
            const yyyyMmDdRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (mmDdYyyyRegex.test(formData.birthdate)) {
                // Convert to ISO format (YYYY-MM-DD) using direct string manipulation
                const [month, day, year] = formData.birthdate.split('/');
                const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                // Update the form data with the ISO date and preserve original format
                setFormData(prev => ({
                    ...prev,
                    birthdate: isoDate,
                    originalDateFormat: formData.birthdate // Store the original format
                }));
            }
            else if (yyyyMmDdRegex.test(formData.birthdate)) {
                // Already in ISO format, store as original format too
                setFormData(prev => ({
                    ...prev,
                    originalDateFormat: formData.birthdate
                }));
            }
            else {
                newErrors.birthdate = 'Birth date must be in MM/DD/YYYY format';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Store the original date format before validation
        const originalFormat = formData.birthdate;
        // Convert date format before validation if it's in MM/DD/YYYY format
        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(formData.birthdate)) {
            const isoDate = formatDateForStorage(formData.birthdate);
            setFormData(prev => ({
                ...prev,
                birthdate: isoDate,
                originalDateFormat: originalFormat
            }));
        }
        if (!validateForm()) {
            return;
        }
        setLoading(true);
        try {
            const dataToSubmit = {
                name: formData.name,
                birthdate: formData.birthdate,
                originalDateFormat: formData.originalDateFormat || originalFormat
            };
            console.log('Submitting data:', dataToSubmit);
            if (isEditing && id) {
                // Update existing person
                const success = await updatePerson(parseInt(id), dataToSubmit);
                if (success) {
                    navigate('/dashboard/people');
                }
                else {
                    throw new Error('Failed to update person');
                }
            }
            else {
                // Add new person
                const newPerson = await addPerson(dataToSubmit);
                if (newPerson) {
                    navigate('/dashboard/people');
                }
                else {
                    throw new Error('Failed to add person');
                }
            }
        }
        catch (error) {
            console.error('Error saving person:', error);
            alert('Failed to save person. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(FormLayout, { children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(FormHeader, { title: isEditing ? 'Edit Person' : 'Add Person', description: "Enter the person's details to add them to your database." }), _jsxs(FormSection, { title: "Person Information", children: [_jsx(FormField, { label: "Name", required: true, error: errors.name, children: _jsx("input", { id: "name", name: "name", type: "text", value: formData.name, onChange: handleChange, className: "form-input w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50", placeholder: "Enter full name", required: true }) }), _jsx(FormField, { label: "Birth Date", required: true, error: errors.birthdate, helpText: "Enter your birth date in MM/DD/YYYY format (e.g., 11/16/1974).", children: _jsx("input", { id: "birthdate", name: "birthdate", type: "text", value: formData.birthdate, onChange: (e) => {
                                    const value = e.target.value;
                                    // Store the original input value
                                    setFormData(prev => ({
                                        ...prev,
                                        birthdate: value,
                                        originalDateFormat: value
                                    }));
                                }, onBlur: (e) => {
                                    const value = e.target.value;
                                    if (value) {
                                        try {
                                            // Store the original format
                                            const originalFormat = value;
                                            // If the value is in MM/DD/YYYY format, keep it as is for display
                                            if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) {
                                                // No need to change the display value
                                                // But update the form data with the ISO format for submission
                                                const isoDate = formatDateForStorage(value);
                                                setFormData(prev => ({
                                                    ...prev,
                                                    birthdate: value,
                                                    originalDateFormat: originalFormat
                                                }));
                                            }
                                            // If the value is in YYYY-MM-DD format, convert it to MM/DD/YYYY for display
                                            else if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                                                const displayDate = formatDateForDisplay(value);
                                                e.target.value = displayDate;
                                                setFormData(prev => ({
                                                    ...prev,
                                                    birthdate: displayDate,
                                                    originalDateFormat: displayDate
                                                }));
                                            }
                                        }
                                        catch (error) {
                                            // If conversion fails, keep the original value
                                            console.error('Error converting date:', error);
                                        }
                                    }
                                }, placeholder: "MM/DD/YYYY", className: "form-input w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50", required: true }) })] }), _jsx(FormFooter, { primaryButton: _jsx("button", { type: "submit", className: "px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed", disabled: loading, children: loading ? (_jsxs("span", { className: "flex items-center justify-center", children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Saving..."] })) : ('Save Person') }), secondaryButton: _jsx("button", { type: "button", className: "px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2", onClick: () => navigate('/dashboard/people'), disabled: loading, children: "Cancel" }) })] }) }));
};
export default PersonFormPage;
