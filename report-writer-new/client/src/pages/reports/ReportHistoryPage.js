import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useReports } from '@/hooks/useReports';
import { FormLayout, FormHeader } from '@/components/forms';
const ReportHistoryPage = () => {
    const { reports, loading, error, downloadReport, deleteReport } = useReports();
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const handleDownload = async (reportId) => {
        await downloadReport(reportId);
    };
    const handleDelete = async (reportId) => {
        if (await deleteReport(reportId)) {
            setDeleteConfirmId(null);
        }
    };
    const getReportTypeLabel = (type) => {
        // Handle null or undefined type
        if (!type) {
            return 'Report';
        }
        // Normalize the type to lowercase for more resilient matching
        const normalizedType = type.toLowerCase();
        switch (normalizedType) {
            case 'yearly':
                return 'Yearly Report';
            case 'life':
                return 'Life Report';
            case 'relationship':
                return 'Relationship Report';
            case 'financial':
                return 'Financial Report';
            default:
                return 'Report';
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    return (_jsxs(FormLayout, { children: [_jsx(FormHeader, { title: "Report History", description: "View and download your previously generated reports." }), error && (_jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6", role: "alert", children: [_jsx("strong", { className: "font-bold", children: "Error: " }), _jsx("span", { className: "block sm:inline", children: error })] })), loading ? (_jsx("div", { className: "flex justify-center py-8", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" }) })) : reports.length === 0 ? (_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 text-center", children: [_jsx("p", { className: "text-secondary mb-4", children: "You haven't generated any reports yet." }), _jsx("p", { className: "text-sm text-secondary", children: "Go to the dashboard to generate your first report." })] })) : (_jsxs("div", { className: "bg-white rounded-lg shadow-md overflow-hidden", children: [_jsxs("div", { className: "p-4 border-b border-gray-200 bg-gray-50", children: [_jsx("h3", { className: "text-lg font-medium", children: "Your Reports" }), _jsx("p", { className: "text-sm text-secondary", children: "View and download your previously generated reports." })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-secondary-dark uppercase tracking-wider", children: "Type" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-secondary-dark uppercase tracking-wider", children: "Person(s)" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-secondary-dark uppercase tracking-wider", children: "Date Created" }), _jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-secondary-dark uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: reports.map(report => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm font-medium text-secondary-dark", children: getReportTypeLabel(report.type) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-secondary", children: report.type === 'relationship' && report.person2Name
                                                        ? `${report.person1Name} & ${report.person2Name}`
                                                        : report.person1Name }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-secondary", children: formatDate(report.createdAt) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: deleteConfirmId === report.id ? (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: () => handleDelete(report.id), className: "text-red-600 hover:text-red-900", children: "Confirm" }), _jsx("button", { onClick: () => setDeleteConfirmId(null), className: "text-gray-500 hover:text-gray-700", children: "Cancel" })] })) : (_jsxs("div", { children: [_jsx("button", { onClick: () => handleDownload(report.id), className: "text-primary hover:text-primary-light mr-4", children: "Download" }), _jsx("button", { onClick: () => setDeleteConfirmId(report.id), className: "text-red-600 hover:text-red-800", children: "Delete" })] })) })] }, report.id))) })] }) })] }))] }));
};
export default ReportHistoryPage;
