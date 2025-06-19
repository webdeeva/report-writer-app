import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/context/authStore';
import { createAuthenticatedAxios } from '@/services/authService';
const UserManagementPage = () => {
    const { user: currentUser } = useAuthStore();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        isAdmin: false,
        isPremium: false,
        reportLimit: null
    });
    const [userUsage, setUserUsage] = useState({});
    // Fetch users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const authAxios = createAuthenticatedAxios();
            const response = await authAxios.get('/api/admin/users');
            setUsers(response.data);
            setError(null);
        }
        catch (err) {
            setError('Failed to fetch users');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    // Fetch usage for each user
    const fetchUserUsage = async (userId) => {
        try {
            const authAxios = createAuthenticatedAxios();
            const response = await authAxios.get(`/api/admin/users/${userId}/usage`);
            setUserUsage(prev => ({
                ...prev,
                [userId]: response.data
            }));
        }
        catch (err) {
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
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    // Handle report limit input
    const handleReportLimitChange = (e) => {
        const value = e.target.value === '' ? null : parseInt(e.target.value);
        setFormData(prev => ({
            ...prev,
            reportLimit: value
        }));
    };
    // Handle form submission
    const handleSubmit = async (e) => {
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
        }
        catch (err) {
            setError('Failed to create user');
            console.error(err);
        }
    };
    // Handle user deletion
    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?'))
            return;
        try {
            const authAxios = createAuthenticatedAxios();
            await authAxios.delete(`/api/admin/users/${userId}`);
            fetchUsers();
        }
        catch (err) {
            setError('Failed to delete user');
            console.error(err);
        }
    };
    // Handle updating user report limit
    const handleUpdateReportLimit = async (userId, reportLimit) => {
        try {
            const authAxios = createAuthenticatedAxios();
            await authAxios.patch(`/api/admin/users/${userId}`, { reportLimit });
            fetchUsers();
        }
        catch (err) {
            setError('Failed to update report limit');
            console.error(err);
        }
    };
    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };
    if (!currentUser?.isAdmin) {
        return _jsx("div", { className: "p-4", children: "You do not have permission to access this page." });
    }
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h2", { className: "text-2xl font-bold", children: "User Management" }), _jsx("button", { onClick: () => setShowAddForm(!showAddForm), className: "btn bg-secondary-dark text-white hover:bg-secondary-light", children: showAddForm ? 'Cancel' : '+ Add User' })] }), error && (_jsx("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4", children: error })), showAddForm && (_jsxs("div", { className: "card mb-6", children: [_jsx("h3", { className: "text-xl font-bold mb-4", children: "Add New User" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Username" }), _jsx("input", { type: "text", name: "username", value: formData.username, onChange: handleInputChange, className: "form-input", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Password" }), _jsx("input", { type: "password", name: "password", value: formData.password, onChange: handleInputChange, className: "form-input", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Report Limit (leave empty for unlimited)" }), _jsx("input", { type: "number", name: "reportLimit", value: formData.reportLimit === null ? '' : formData.reportLimit, onChange: handleReportLimitChange, className: "form-input", min: "0" })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", name: "isAdmin", checked: formData.isAdmin, onChange: handleInputChange, className: "mr-2" }), _jsx("label", { children: "Admin User" })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", name: "isPremium", checked: formData.isPremium, onChange: handleInputChange, className: "mr-2" }), _jsx("label", { children: "Premium User" })] })] }), _jsx("button", { type: "submit", className: "btn bg-secondary-dark text-white hover:bg-secondary-light", children: "Create User" })] })] })), loading ? (_jsx("div", { className: "text-center py-4", children: "Loading users..." })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-100", children: [_jsx("th", { className: "border p-2 text-left", children: "Username" }), _jsx("th", { className: "border p-2 text-left", children: "Role" }), _jsx("th", { className: "border p-2 text-left", children: "Premium" }), _jsx("th", { className: "border p-2 text-left", children: "Created" }), _jsx("th", { className: "border p-2 text-left", children: "Report Limit" }), _jsx("th", { className: "border p-2 text-left", children: "Reports Generated" }), _jsx("th", { className: "border p-2 text-left", children: "Tokens Used" }), _jsx("th", { className: "border p-2 text-left", children: "Total Cost" }), _jsx("th", { className: "border p-2 text-left", children: "Actions" })] }) }), _jsx("tbody", { children: users.map(user => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "border p-2", children: user.username }), _jsx("td", { className: "border p-2", children: user.isAdmin ? 'Admin' : 'User' }), _jsx("td", { className: "border p-2", children: _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: user.isPremium, onChange: (e) => {
                                                        const updatedUsers = users.map(u => u.id === user.id ? { ...u, isPremium: e.target.checked } : u);
                                                        setUsers(updatedUsers);
                                                        // Update user premium status
                                                        const authAxios = createAuthenticatedAxios();
                                                        authAxios.patch(`/api/admin/users/${user.id}`, { isPremium: e.target.checked })
                                                            .catch(err => {
                                                            console.error('Failed to update premium status', err);
                                                            setError('Failed to update premium status');
                                                            fetchUsers(); // Refresh to get the correct state
                                                        });
                                                    }, className: "mr-2" }), _jsx("span", { children: user.isPremium ? 'Yes' : 'No' })] }) }), _jsx("td", { className: "border p-2", children: new Date(user.createdAt).toLocaleDateString() }), _jsx("td", { className: "border p-2", children: _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "number", value: user.reportLimit === null ? '' : user.reportLimit, onChange: (e) => {
                                                        const value = e.target.value === '' ? null : parseInt(e.target.value);
                                                        const updatedUsers = users.map(u => u.id === user.id ? { ...u, reportLimit: value } : u);
                                                        setUsers(updatedUsers);
                                                    }, className: "form-input w-20 mr-2", min: "0" }), _jsx("button", { onClick: () => handleUpdateReportLimit(user.id, user.reportLimit || null), className: "text-secondary-dark hover:text-secondary-light", children: "Update" })] }) }), _jsxs("td", { className: "border p-2", children: [userUsage[user.id]?.totalReports || 0, user.reportLimit !== null && ` / ${user.reportLimit}`] }), _jsx("td", { className: "border p-2", children: userUsage[user.id]?.totalTokens || 0 }), _jsx("td", { className: "border p-2", children: formatCurrency(userUsage[user.id]?.totalCost || 0) }), _jsx("td", { className: "border p-2", children: _jsx("button", { onClick: () => handleDeleteUser(user.id), className: "text-red-600 hover:text-red-800", disabled: user.id === currentUser?.id, children: "Delete" }) })] }, user.id))) })] }) }))] }));
};
export default UserManagementPage;
