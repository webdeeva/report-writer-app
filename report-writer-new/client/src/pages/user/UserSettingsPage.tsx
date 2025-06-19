import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/context/authStore';
import { 
  getUserSettings, 
  saveUserSettings, 
  fileToBase64,
  UserSettings
} from '@/services/localStorageService';

const UserSettingsPage = () => {
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useState<UserSettings>({
    logoPath: null,
    footerText: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch user settings from localStorage
  const fetchSettings = () => {
    try {
      setLoading(true);
      const storedSettings = getUserSettings();
      setSettings(storedSettings);
      setError(null);
    } catch (err) {
      setError('Failed to fetch settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Handle logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
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
    } catch (err) {
      setError('Failed to upload logo');
      console.error(err);
    } finally {
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      
      // Save settings to localStorage
      const success = saveUserSettings(settings);
      
      if (success) {
        setSuccessMessage('Settings saved successfully');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (err) {
      setError('Failed to save settings');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">User Settings</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-4">Loading settings...</div>
      ) : (
        <form onSubmit={handleSubmit} className="card">
          <h3 className="text-xl font-bold mb-4">Report Customization</h3>
          
          <div className="mb-6">
            <label className="form-label">Custom Logo</label>
            <div className="flex items-center mb-2">
              <button
                type="button"
                onClick={triggerFileInput}
                className="btn bg-secondary text-white hover:bg-secondary-light mr-2"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Logo'}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                className="hidden"
                accept="image/*"
              />
              {settings.logoPath && (
                <span className="text-sm text-green-600">Logo uploaded</span>
              )}
            </div>
            {settings.logoPath && (
              <div className="mt-2 border p-2 rounded">
                <img 
                  src={settings.logoPath} 
                  alt="Custom Logo" 
                  className="max-h-20 max-w-full"
                />
              </div>
            )}
            <p className="text-sm text-secondary mt-1">
              Upload a logo to display on reports (max 5MB, image files only)
            </p>
          </div>
          
          <div className="mb-6">
            <label className="form-label">Custom Footer Text</label>
            <textarea
              name="footerText"
              value={settings.footerText || ''}
              onChange={handleInputChange}
              className="form-input h-20"
              placeholder="Enter custom footer text (supports markdown)"
            />
            <p className="text-sm text-secondary mt-1">
              Custom footer text to display on reports (supports markdown)
            </p>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn bg-primary text-white hover:bg-primary-light"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserSettingsPage;
