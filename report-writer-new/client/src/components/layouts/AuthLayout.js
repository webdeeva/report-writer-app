import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
/**
 * Layout for authentication pages (login, register, etc.)
 */
const AuthLayout = () => {
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-background-alt", children: _jsxs("div", { className: "w-full max-w-md p-8 bg-white rounded-lg shadow-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-primary", children: import.meta.env.VITE_APP_NAME || 'Report Writer' }), _jsx("p", { className: "text-secondary mt-2", children: "Generate personalized card-based reports" })] }), _jsx(Outlet, {})] }) }));
};
export default AuthLayout;
