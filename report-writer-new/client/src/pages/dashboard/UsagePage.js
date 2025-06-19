import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/context/authStore';
const UsagePage = () => {
    const { user } = useAuthStore();
    const [usageData, setUsageData] = useState(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Fetch usage data
    const fetchUsageData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/users/usage');
            setUsageData(response.data);
            setError(null);
        }
        catch (err) {
            setError('Failed to fetch usage data');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    // Fetch reports
    const fetchReports = async () => {
        try {
            const response = await axios.get('/api/reports');
            setReports(response.data);
        }
        catch (err) {
            console.error('Failed to fetch reports', err);
        }
    };
    // Load data on component mount
    useEffect(() => {
        fetchUsageData();
        fetchReports();
    }, []);
    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };
    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    if (loading) {
        return _jsx("div", { className: "text-center py-4", children: "Loading usage data..." });
    }
    if (error) {
        return (_jsx("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded", children: error }));
    }
    return (_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Usage Statistics" }), usageData && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [_jsxs("div", { className: "card hover:shadow-lg transition-shadow", children: [_jsx("h3", { className: "text-xl font-bold mb-2", children: "Reports Generated" }), _jsxs("div", { className: "text-4xl font-bold text-secondary-dark mb-2", children: [usageData.totalReports, usageData.reportLimit !== null && (_jsxs("span", { className: "text-lg text-secondary ml-2", children: ["of ", usageData.reportLimit] }))] }), usageData.reportLimit !== null && (_jsx("div", { className: "w-full bg-gray-200 rounded-full h-2.5 mb-4", children: _jsx("div", { className: "bg-secondary-dark h-2.5 rounded-full", style: { width: `${Math.min(100, (usageData.totalReports / usageData.reportLimit) * 100)}%` } }) })), usageData.remainingReports !== null && (_jsxs("p", { className: "text-secondary", children: [usageData.remainingReports, " reports remaining"] }))] }), _jsxs("div", { className: "card hover:shadow-lg transition-shadow", children: [_jsx("h3", { className: "text-xl font-bold mb-2", children: "Tokens Used" }), _jsx("div", { className: "text-4xl font-bold text-secondary-dark mb-2", children: usageData.totalTokens.toLocaleString() }), _jsx("p", { className: "text-secondary", children: "Tokens are used to generate report content" })] }), _jsxs("div", { className: "card hover:shadow-lg transition-shadow", children: [_jsx("h3", { className: "text-xl font-bold mb-2", children: "Total Cost" }), _jsx("div", { className: "text-4xl font-bold text-secondary-dark mb-2", children: formatCurrency(usageData.totalCost) }), _jsx("p", { className: "text-secondary", children: "Cost is calculated based on tokens used" })] })] })), _jsx("h3", { className: "text-xl font-bold mb-4", children: "Report History" }), reports.length === 0 ? (_jsx("div", { className: "text-center py-4 text-secondary", children: "No reports generated yet." })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-100", children: [_jsx("th", { className: "border p-2 text-left", children: "Date" }), _jsx("th", { className: "border p-2 text-left", children: "Report Type" }), _jsx("th", { className: "border p-2 text-left", children: "Person" }), _jsx("th", { className: "border p-2 text-left", children: "Tokens Used" }), _jsx("th", { className: "border p-2 text-left", children: "Cost" })] }) }), _jsx("tbody", { children: reports.map(report => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "border p-2", children: formatDate(report.createdAt) }), _jsxs("td", { className: "border p-2", children: [report.type === 'yearly' && 'Yearly Report', report.type === 'life' && 'Life Report', report.type === 'relationship' && 'Relationship Report'] }), _jsxs("td", { className: "border p-2", children: [report.person1Name, report.person2Name && ` & ${report.person2Name}`] }), _jsx("td", { className: "border p-2", children: report.tokensUsed.toLocaleString() }), _jsx("td", { className: "border p-2", children: formatCurrency(report.cost) })] }, report.id))) })] }) }))] }));
};
export default UsagePage;
