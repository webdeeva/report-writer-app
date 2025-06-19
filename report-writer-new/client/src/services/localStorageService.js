/**
 * Local Storage Service
 *
 * This service provides functions for storing and retrieving data from localStorage.
 * It handles serialization/deserialization of JSON data and provides type safety.
 */
// Keys for localStorage
export const STORAGE_KEYS = {
    USER_SETTINGS: 'user_settings',
};
/**
 * Get user settings from localStorage
 * @returns UserSettings object or default settings if not found
 */
export const getUserSettings = () => {
    try {
        const settingsJson = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
        if (!settingsJson) {
            return {
                logoPath: null,
                footerText: null
            };
        }
        return JSON.parse(settingsJson);
    }
    catch (error) {
        console.error('Error getting user settings from localStorage:', error);
        return {
            logoPath: null,
            footerText: null
        };
    }
};
/**
 * Save user settings to localStorage
 * @param settings UserSettings object to save
 * @returns boolean indicating success
 */
export const saveUserSettings = (settings) => {
    try {
        localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
        return true;
    }
    catch (error) {
        console.error('Error saving user settings to localStorage:', error);
        return false;
    }
};
/**
 * Update specific user settings fields
 * @param settingsUpdate Partial UserSettings object with fields to update
 * @returns boolean indicating success
 */
export const updateUserSettings = (settingsUpdate) => {
    try {
        const currentSettings = getUserSettings();
        const updatedSettings = {
            ...currentSettings,
            ...settingsUpdate
        };
        return saveUserSettings(updatedSettings);
    }
    catch (error) {
        console.error('Error updating user settings in localStorage:', error);
        return false;
    }
};
/**
 * Clear user settings from localStorage
 * @returns boolean indicating success
 */
export const clearUserSettings = () => {
    try {
        localStorage.removeItem(STORAGE_KEYS.USER_SETTINGS);
        return true;
    }
    catch (error) {
        console.error('Error clearing user settings from localStorage:', error);
        return false;
    }
};
/**
 * Convert a file to base64 string
 * @param file File to convert
 * @returns Promise resolving to base64 string
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};
