import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/context/authStore';

interface AppSettings {
  id?: number;
  apiKey?: string;
  costPerToken?: number;
  defaultReportLimit?: number | null;
  maxTokensPerRequest?: number;
  systemPrompt?: string;
  logoPath?: string | null;
  footerText?: string | null;
  assignedUserId?: number | null;
}

interface User {
  id: number;
  username: string;
}

const SettingsPage = () => {
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useState<AppSettings>({
    apiKey: '',
    costPerToken: 0.00002,
    defaultReportLimit: null,
    maxTokensPerRequest: 4000,
    systemPrompt: '',
    logoPath: null,
    footerText: '',
    assignedUserId: null
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/settings');
      setSettings(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch settings');
      console.error(err);
    } finally {
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
    } catch (err) {
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
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
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

  // Handle select change
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? null : parseInt(value);
    setSettings(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle number input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? null : parseFloat(value);
    setSettings(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      
      await axios.post('/api/admin/settings', settings);
      
      setSuccessMessage('Settings saved successfully');
    } catch (err) {
      setError('Failed to save settings');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!user?.isAdmin) {
    return <div className="p-4">You do not have permission to access this page.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Application Settings</h2>
      
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="form-label">API Key</label>
              <input
                type="password"
                name="apiKey"
                value={settings.apiKey || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter API key"
              />
              <p className="text-sm text-secondary mt-1">
                API key for the AI service
              </p>
            </div>
            
            <div>
              <label className="form-label">Cost Per Token</label>
              <input
                type="number"
                name="costPerToken"
                value={settings.costPerToken || ''}
                onChange={handleNumberChange}
                className="form-input"
                step="0.000001"
                min="0"
              />
              <p className="text-sm text-secondary mt-1">
                Cost per token in USD
              </p>
            </div>
            
            <div>
              <label className="form-label">Default Report Limit</label>
              <input
                type="number"
                name="defaultReportLimit"
                value={settings.defaultReportLimit === null ? '' : settings.defaultReportLimit}
                onChange={handleNumberChange}
                className="form-input"
                min="0"
                placeholder="No limit"
              />
              <p className="text-sm text-secondary mt-1">
                Default report limit for new users (leave empty for unlimited)
              </p>
            </div>
            
            <div>
              <label className="form-label">Max Tokens Per Request</label>
              <input
                type="number"
                name="maxTokensPerRequest"
                value={settings.maxTokensPerRequest || ''}
                onChange={handleNumberChange}
                className="form-input"
                min="1000"
              />
              <p className="text-sm text-secondary mt-1">
                Maximum tokens per AI request
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="form-label">System Prompt</label>
            <textarea
              name="systemPrompt"
              value={settings.systemPrompt || ''}
              onChange={handleInputChange}
              className="form-input h-40"
              placeholder="Enter system prompt for AI"
            />
            <p className="text-sm text-secondary mt-1">
              System prompt used for AI report generation
            </p>
          </div>

          <h3 className="text-xl font-bold mb-4 mt-8">Report Customization</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
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
            
            <div>
              <label className="form-label">Assign to User</label>
              <select
                name="assignedUserId"
                value={settings.assignedUserId || ''}
                onChange={handleSelectChange}
                className="form-input"
              >
                <option value="">None (Admin Only)</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
              <p className="text-sm text-secondary mt-1">
                Assign this logo and footer to a specific user
              </p>
            </div>
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

export default SettingsPage;
