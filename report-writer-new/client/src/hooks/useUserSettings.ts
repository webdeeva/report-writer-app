import { useState, useEffect } from 'react';
import { getUserSettings, saveUserSettings, UserSettings } from '@/services/localStorageService';

/**
 * Hook for accessing and managing user settings from localStorage
 * 
 * @returns Object containing user settings and functions to manage them
 */
export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings>({
    logoPath: null,
    footerText: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings on mount
  useEffect(() => {
    try {
      const storedSettings = getUserSettings();
      setSettings(storedSettings);
      setError(null);
    } catch (err) {
      console.error('Error loading user settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update settings
  const updateSettings = (newSettings: Partial<UserSettings>) => {
    try {
      const updatedSettings = {
        ...settings,
        ...newSettings
      };
      
      const success = saveUserSettings(updatedSettings);
      
      if (success) {
        setSettings(updatedSettings);
        setError(null);
        return true;
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (err) {
      console.error('Error updating user settings:', err);
      setError('Failed to update settings');
      return false;
    }
  };

  // Reset settings to defaults
  const resetSettings = () => {
    try {
      const defaultSettings: UserSettings = {
        logoPath: null,
        footerText: null
      };
      
      const success = saveUserSettings(defaultSettings);
      
      if (success) {
        setSettings(defaultSettings);
        setError(null);
        return true;
      } else {
        throw new Error('Failed to reset settings');
      }
    } catch (err) {
      console.error('Error resetting user settings:', err);
      setError('Failed to reset settings');
      return false;
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    resetSettings
  };
};

export default useUserSettings;
