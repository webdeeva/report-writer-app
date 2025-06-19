import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/context/authStore';
const SettingsPage = () => {
    const { user } = useAuthStore();
    const fileInputRef = useRef(null);
    const [settings, setSettings] = useState({
        apiKey: '',
        costPerToken: 0.00002,
        defaultReportLimit: null,
        maxTokensPerRequest: 4000,
        systemPrompt: '',
        logoPath: null,
        footerText: '',
        assignedUserId: null
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    // Fetch settings
    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/admin/settings');
            setSettings(response.data);
            setError(null);
        }
        catch (err) {
            setError('Failed to fetch settings');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    // Fetch users for dropdown
    const fetchUsers = async () => {
        try {
            console.log('Fetching users for dropdown...');
            const response = await axios.get('/api/admin/users-dropdown');
            console.log('Users response:', response.data);
            setUsers(response.data);
        }
        catch (err) {
            console.error('Failed to fetch users:', err);
            setError('Failed to fetch users for dropdown. Check console for details.');
            // Continue without users
        }
    };
    // Load settings and users on component mount
    useEffect(() => {
        fetchSettings();
        fetchUsers();
    }, []);
    // Handle logo upload
    const handleLogoUpload = async (e) => {
        if (!e.target.files || e.target.files.length === 0)
            return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('logo', file);
        try {
            setUploading(true);
            setError(null);
            const response = await axios.post('/api/admin/upload-logo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Update settings with new logo path
            setSettings(prev => ({
                ...prev,
                logoPath: response.data.logoPath
            }));
            setSuccessMessage('Logo uploaded successfully');
        }
        catch (err) {
            setError('Failed to upload logo');
            console.error(err);
        }
        finally {
            setUploading(false);
        }
    };
    // Trigger file input click
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    // Handle select change
    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        const numValue = value === '' ? null : parseInt(value);
        setSettings(prev => ({
            ...prev,
            [name]: numValue
        }));
    };
    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };
    // Handle number input changes
    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        const numValue = value === '' ? null : parseFloat(value);
        setSettings(prev => ({
            ...prev,
            [name]: numValue
        }));
    };
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError(null);
            setSuccessMessage(null);
            await axios.post('/api/admin/settings', settings);
            setSuccessMessage('Settings saved successfully');
        }
        catch (err) {
            setError('Failed to save settings');
            console.error(err);
        }
        finally {
            setSaving(false);
        }
    };
    if (!user?.isAdmin) {
        return _jsx("div", { className: "p-4", children: "You do not have permission to access this page." });
    }
    return (_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Application Settings" }), error && (_jsx("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4", children: error })), successMessage && (_jsx("div", { className: "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4", children: successMessage })), loading ? (_jsx("div", { className: "text-center py-4", children: "Loading settings..." })) : (_jsxs("form", { onSubmit: handleSubmit, className: "card", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [_jsxs("div", { children: [_jsx("label", { className: "form-label", children: "API Key" }), _jsx("input", { type: "password", name: "apiKey", value: settings.apiKey || '', onChange: handleInputChange, className: "form-input", placeholder: "Enter API key" }), _jsx("p", { className: "text-sm text-secondary mt-1", children: "API key for the AI service" })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Cost Per Token" }), _jsx("input", { type: "number", name: "costPerToken", value: settings.costPerToken || '', onChange: handleNumberChange, className: "form-input", step: "0.000001", min: "0" }), _jsx("p", { className: "text-sm text-secondary mt-1", children: "Cost per token in USD" })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Default Report Limit" }), _jsx("input", { type: "number", name: "defaultReportLimit", value: settings.defaultReportLimit === null ? '' : settings.defaultReportLimit, onChange: handleNumberChange, className: "form-input", min: "0", placeholder: "No limit" }), _jsx("p", { className: "text-sm text-secondary mt-1", children: "Default report limit for new users (leave empty for unlimited)" })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Max Tokens Per Request" }), _jsx("input", { type: "number", name: "maxTokensPerRequest", value: settings.maxTokensPerRequest || '', onChange: handleNumberChange, className: "form-input", min: "1000" }), _jsx("p", { className: "text-sm text-secondary mt-1", children: "Maximum tokens per AI request" })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "form-label", children: "System Prompt" }), _jsx("textarea", { name: "systemPrompt", value: settings.systemPrompt || '', onChange: handleInputChange, className: "form-input h-40", placeholder: "Enter system prompt for AI" }), _jsx("p", { className: "text-sm text-secondary mt-1", children: "System prompt used for AI report generation" })] }), _jsx("h3", { className: "text-xl font-bold mb-4 mt-8", children: "Report Customization" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [_jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Custom Logo" }), _jsxs("div", { className: "flex items-center mb-2", children: [_jsx("button", { type: "button", onClick: triggerFileInput, className: "btn bg-secondary text-white hover:bg-secondary-light mr-2", disabled: uploading, children: uploading ? 'Uploading...' : 'Upload Logo' }), _jsx("input", { type: "file", ref: fileInputRef, onChange: handleLogoUpload, className: "hidden", accept: "image/*" }), settings.logoPath && (_jsx("span", { className: "text-sm text-green-600", children: "Logo uploaded" }))] }), settings.logoPath && (_jsx("div", { className: "mt-2 border p-2 rounded", children: _jsx("img", { src: settings.logoPath, alt: "Custom Logo", className: "max-h-20 max-w-full" }) })), _jsx("p", { className: "text-sm text-secondary mt-1", children: "Upload a logo to display on reports (max 5MB, image files only)" })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Assign to User" }), _jsxs("select", { name: "assignedUserId", value: settings.assignedUserId || '', onChange: handleSelectChange, className: "form-input", children: [_jsx("option", { value: "", children: "None (Admin Only)" }), users.map(user => (_jsx("option", { value: user.id, children: user.username }, user.id)))] }), _jsx("p", { className: "text-sm text-secondary mt-1", children: "Assign this logo and footer to a specific user" })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "form-label", children: "Custom Footer Text" }), _jsx("textarea", { name: "footerText", value: settings.footerText || '', onChange: handleInputChange, className: "form-input h-20", placeholder: "Enter custom footer text (supports markdown)" }), _jsx("p", { className: "text-sm text-secondary mt-1", children: "Custom footer text to display on reports (supports markdown)" })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "submit", className: "btn bg-primary text-white hover:bg-primary-light", disabled: saving, children: saving ? 'Saving...' : 'Save Settings' }) })] }))] }));
};
export default SettingsPage;
