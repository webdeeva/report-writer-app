import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/context/authStore';
import { getUserSettings, saveUserSettings, fileToBase64 } from '@/services/localStorageService';
const UserSettingsPage = () => {
    const { user } = useAuthStore();
    const fileInputRef = useRef(null);
    const [settings, setSettings] = useState({
        logoPath: null,
        footerText: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    // Fetch user settings from localStorage
    const fetchSettings = () => {
        try {
            setLoading(true);
            const storedSettings = getUserSettings();
            setSettings(storedSettings);
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
    // Load settings on component mount
    useEffect(() => {
        fetchSettings();
    }, []);
    // Handle logo upload
    const handleLogoUpload = async (e) => {
        if (!e.target.files || e.target.files.length === 0)
            return;
        const file = e.target.files[0];
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Logo file size must be less than 5MB');
            return;
        }
        try {
            setUploading(true);
            setError(null);
            // Convert file to base64
            const base64Logo = await fileToBase64(file);
            // Update settings with new logo
            const updatedSettings = {
                ...settings,
                logoPath: base64Logo
            };
            // Save to localStorage
            saveUserSettings(updatedSettings);
            // Update state
            setSettings(updatedSettings);
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
    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError(null);
            setSuccessMessage(null);
            // Save settings to localStorage
            const success = saveUserSettings(settings);
            if (success) {
                setSuccessMessage('Settings saved successfully');
            }
            else {
                throw new Error('Failed to save settings');
            }
        }
        catch (err) {
            setError('Failed to save settings');
            console.error(err);
        }
        finally {
            setSaving(false);
        }
    };
    return (_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "User Settings" }), error && (_jsx("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4", children: error })), successMessage && (_jsx("div", { className: "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4", children: successMessage })), loading ? (_jsx("div", { className: "text-center py-4", children: "Loading settings..." })) : (_jsxs("form", { onSubmit: handleSubmit, className: "card", children: [_jsx("h3", { className: "text-xl font-bold mb-4", children: "Report Customization" }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "form-label", children: "Custom Logo" }), _jsxs("div", { className: "flex items-center mb-2", children: [_jsx("button", { type: "button", onClick: triggerFileInput, className: "btn bg-secondary text-white hover:bg-secondary-light mr-2", disabled: uploading, children: uploading ? 'Uploading...' : 'Upload Logo' }), _jsx("input", { type: "file", ref: fileInputRef, onChange: handleLogoUpload, className: "hidden", accept: "image/*" }), settings.logoPath && (_jsx("span", { className: "text-sm text-green-600", children: "Logo uploaded" }))] }), settings.logoPath && (_jsx("div", { className: "mt-2 border p-2 rounded", children: _jsx("img", { src: settings.logoPath, alt: "Custom Logo", className: "max-h-20 max-w-full" }) })), _jsx("p", { className: "text-sm text-secondary mt-1", children: "Upload a logo to display on reports (max 5MB, image files only)" })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "form-label", children: "Custom Footer Text" }), _jsx("textarea", { name: "footerText", value: settings.footerText || '', onChange: handleInputChange, className: "form-input h-20", placeholder: "Enter custom footer text (supports markdown)" }), _jsx("p", { className: "text-sm text-secondary mt-1", children: "Custom footer text to display on reports (supports markdown)" })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "submit", className: "btn bg-primary text-white hover:bg-primary-light", disabled: saving, children: saving ? 'Saving...' : 'Save Settings' }) })] }))] }));
};
export default UserSettingsPage;
