import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/context/authStore';
const NotFoundPage = () => {
    const { isAuthenticated } = useAuthStore();
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-background-alt", children: _jsxs("div", { className: "text-center p-8 bg-white rounded-lg shadow-md max-w-md", children: [_jsx("h1", { className: "text-6xl font-bold text-primary mb-4", children: "404" }), _jsx("h2", { className: "text-2xl font-bold text-secondary mb-4", children: "Page Not Found" }), _jsx("p", { className: "text-secondary mb-6", children: "The page you are looking for doesn't exist or has been moved." }), _jsx(Link, { to: isAuthenticated ? '/dashboard' : '/login', className: "btn btn-primary", children: isAuthenticated ? 'Back to Dashboard' : 'Back to Login' })] }) }));
};
export default NotFoundPage;
