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

// User settings interface
export interface UserSettings {
  logoPath?: string | null;
  footerText?: string | null;
}

/**
 * Get user settings from localStorage
 * @returns UserSettings object or default settings if not found
 */
export const getUserSettings = (): UserSettings => {
  try {
    const settingsJson = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
    if (!settingsJson) {
      return {
        logoPath: null,
        footerText: null
      };
    }
    
    return JSON.parse(settingsJson) as UserSettings;
  } catch (error) {
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
export const saveUserSettings = (settings: UserSettings): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving user settings to localStorage:', error);
    return false;
  }
};

/**
 * Update specific user settings fields
 * @param settingsUpdate Partial UserSettings object with fields to update
 * @returns boolean indicating success
 */
export const updateUserSettings = (settingsUpdate: Partial<UserSettings>): boolean => {
  try {
    const currentSettings = getUserSettings();
    const updatedSettings = {
      ...currentSettings,
      ...settingsUpdate
    };
    
    return saveUserSettings(updatedSettings);
  } catch (error) {
    console.error('Error updating user settings in localStorage:', error);
    return false;
  }
};

/**
 * Clear user settings from localStorage
 * @returns boolean indicating success
 */
export const clearUserSettings = (): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_SETTINGS);
    return true;
  } catch (error) {
    console.error('Error clearing user settings from localStorage:', error);
    return false;
  }
};

/**
 * Convert a file to base64 string
 * @param file File to convert
 * @returns Promise resolving to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
