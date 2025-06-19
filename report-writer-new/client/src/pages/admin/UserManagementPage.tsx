import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/context/authStore';
import { createAuthenticatedAxios } from '@/services/authService';

interface User {
  id: number;
  username: string;
  isAdmin: boolean;
  isPremium: boolean;
  createdAt: string;
  reportLimit?: number | null;
}

interface UserFormData {
  username: string;
  password: string;
  isAdmin: boolean;
  isPremium: boolean;
  reportLimit?: number | null;
}

const UserManagementPage = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    password: '',
    isAdmin: false,
    isPremium: false,
    reportLimit: null
  });
  const [userUsage, setUserUsage] = useState<Record<number, { totalReports: number, totalTokens: number, totalCost: number }>>({});
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState<{ userId: number | null, username: string, newPassword: string }>({
    userId: null,
    username: '',
    newPassword: ''
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const authAxios = createAuthenticatedAxios();
      const response = await authAxios.get('/api/admin/users');
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch usage for each user
  const fetchUserUsage = async (userId: number) => {
    try {
      const authAxios = createAuthenticatedAxios();
      const response = await authAxios.get(`/api/admin/users/${userId}/usage`);
      setUserUsage(prev => ({
        ...prev,
        [userId]: response.data
      }));
    } catch (err) {
      console.error(`Failed to fetch usage for user ${userId}`, err);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch usage data for each user
  useEffect(() => {
    users.forEach(user => {
      fetchUserUsage(user.id);
    });
  }, [users]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle report limit input
  const handleReportLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? null : parseInt(e.target.value);
    setFormData(prev => ({
      ...prev,
      reportLimit: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const authAxios = createAuthenticatedAxios();
      await authAxios.post('/api/admin/users', formData);
      setFormData({
        username: '',
        password: '',
        isAdmin: false,
        isPremium: false,
        reportLimit: null
      });
      setShowAddForm(false);
      fetchUsers();
    } catch (err) {
      setError('Failed to create user');
      console.error(err);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const authAxios = createAuthenticatedAxios();
      await authAxios.delete(`/api/admin/users/${userId}`);
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    }
  };

  // Handle updating user report limit
  const handleUpdateReportLimit = async (userId: number, reportLimit: number | null) => {
    try {
      const authAxios = createAuthenticatedAxios();
      await authAxios.patch(`/api/admin/users/${userId}`, { reportLimit });
      fetchUsers();
    } catch (err) {
      setError('Failed to update report limit');
      console.error(err);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordData.userId || !resetPasswordData.newPassword) {
      setError('Please enter a new password');
      return;
    }

    try {
      const authAxios = createAuthenticatedAxios();
      const response = await authAxios.post('/api/admin/users/reset-password', {
        userId: resetPasswordData.userId,
        newPassword: resetPasswordData.newPassword
      });
      
      alert(response.data.message);
      setShowPasswordReset(false);
      setResetPasswordData({ userId: null, username: '', newPassword: '' });
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
      console.error(err);
    }
  };

  // Open password reset modal
  const openPasswordReset = (user: User) => {
    setResetPasswordData({
      userId: user.id,
      username: user.username,
      newPassword: ''
    });
    setShowPasswordReset(true);
    setError(null);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!currentUser?.isAdmin) {
    return <div className="p-4">You do not have permission to access this page.</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn bg-secondary-dark text-white hover:bg-secondary-light"
        >
          {showAddForm ? 'Cancel' : '+ Add User'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="card mb-6">
          <h3 className="text-xl font-bold mb-4">Add New User</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">Report Limit (leave empty for unlimited)</label>
                <input
                  type="number"
                  name="reportLimit"
                  value={formData.reportLimit === null ? '' : formData.reportLimit}
                  onChange={handleReportLimitChange}
                  className="form-input"
                  min="0"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isAdmin"
                  checked={formData.isAdmin}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label>Admin User</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPremium"
                  checked={formData.isPremium}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label>Premium User</label>
              </div>
            </div>
            <button type="submit" className="btn bg-secondary-dark text-white hover:bg-secondary-light">
              Create User
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading users...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Username</th>
                <th className="border p-2 text-left">Role</th>
                <th className="border p-2 text-left">Premium</th>
                <th className="border p-2 text-left">Created</th>
                <th className="border p-2 text-left">Report Limit</th>
                <th className="border p-2 text-left">Reports Generated</th>
                <th className="border p-2 text-left">Tokens Used</th>
                <th className="border p-2 text-left">Total Cost</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border p-2">{user.username}</td>
                  <td className="border p-2">{user.isAdmin ? 'Admin' : 'User'}</td>
                  <td className="border p-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={user.isPremium}
                        onChange={(e) => {
                          const updatedUsers = users.map(u => 
                            u.id === user.id ? { ...u, isPremium: e.target.checked } : u
                          );
                          setUsers(updatedUsers);
                          
                          // Update user premium status
                          const authAxios = createAuthenticatedAxios();
                          authAxios.patch(`/api/admin/users/${user.id}`, { isPremium: e.target.checked })
                            .catch(err => {
                              console.error('Failed to update premium status', err);
                              setError('Failed to update premium status');
                              fetchUsers(); // Refresh to get the correct state
                            });
                        }}
                        className="mr-2"
                      />
                      <span>{user.isPremium ? 'Yes' : 'No'}</span>
                    </div>
                  </td>
                  <td className="border p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="border p-2">
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={user.reportLimit === null ? '' : user.reportLimit}
                        onChange={(e) => {
                          const value = e.target.value === '' ? null : parseInt(e.target.value);
                          const updatedUsers = users.map(u => 
                            u.id === user.id ? { ...u, reportLimit: value } : u
                          );
                          setUsers(updatedUsers);
                        }}
                        className="form-input w-20 mr-2"
                        min="0"
                      />
                      <button
                        onClick={() => handleUpdateReportLimit(user.id, user.reportLimit || null)}
                        className="text-secondary-dark hover:text-secondary-light"
                      >
                        Update
                      </button>
                    </div>
                  </td>
                  <td className="border p-2">
                    {userUsage[user.id]?.totalReports || 0}
                    {user.reportLimit !== null && ` / ${user.reportLimit}`}
                  </td>
                  <td className="border p-2">{userUsage[user.id]?.totalTokens || 0}</td>
                  <td className="border p-2">{formatCurrency(userUsage[user.id]?.totalCost || 0)}</td>
                  <td className="border p-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openPasswordReset(user)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Reset Password
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={user.id === currentUser?.id}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordReset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Reset Password</h3>
            <p className="mb-4">Reset password for user: <strong>{resetPasswordData.username}</strong></p>
            
            <form onSubmit={handlePasswordReset}>
              <div className="mb-4">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  value={resetPasswordData.newPassword}
                  onChange={(e) => setResetPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="form-input"
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordReset(false);
                    setResetPasswordData({ userId: null, username: '', newPassword: '' });
                    setError(null);
                  }}
                  className="btn bg-gray-500 text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-secondary-dark text-white hover:bg-secondary-light"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
