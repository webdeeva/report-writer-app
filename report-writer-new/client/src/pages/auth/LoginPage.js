import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/context/authStore';
import { toast } from 'react-toastify';
const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuthStore();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            toast.error('Please enter both username and password');
            return;
        }
        try {
            await login(username, password);
            // Check if login was successful
            if (useAuthStore.getState().isAuthenticated) {
                toast.success('Login successful');
                navigate('/dashboard');
            }
        }
        catch (error) {
            // Error is handled by the auth store
            console.error('Login error:', error);
        }
    };
    return (_jsx("div", { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [error && (_jsx("div", { className: "bg-red-50 text-red-600 p-3 rounded-md text-sm", children: error })), _jsxs("div", { children: [_jsx("label", { htmlFor: "username", className: "form-label", children: "Username" }), _jsx("input", { id: "username", type: "text", value: username, onChange: (e) => setUsername(e.target.value), className: "form-input", placeholder: "Enter your username", disabled: isLoading })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "form-label", children: "Password" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "form-input", placeholder: "Enter your password", disabled: isLoading })] }), _jsx("div", { children: _jsx("button", { type: "submit", className: "btn btn-primary w-full", disabled: isLoading, children: isLoading ? (_jsxs("span", { className: "flex items-center justify-center", children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Logging in..."] })) : ('Login') }) }), _jsx("div", { className: "text-center text-sm text-secondary", children: _jsxs("p", { children: ["Default credentials: ", _jsx("br", {}), "Username: ", _jsx("strong", { children: "admin" }), " ", _jsx("br", {}), "Password: ", _jsx("strong", { children: "admin123" })] }) })] }) }));
};
export default LoginPage;
