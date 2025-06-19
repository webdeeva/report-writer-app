import { useState, useEffect } from 'react';
import { useAuthStore } from '../context/authStore';
/**
 * Custom hook for fetching and managing reports data
 *
 * This hook provides access to the user's list of reports, with loading and error states.
 * It automatically fetches the data when the component mounts and provides functions
 * for downloading and deleting reports.
 */
export const useReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuthStore();
    // Fetch reports from the API
    const fetchReports = async () => {
        if (!token)
            return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reports`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching reports: ${response.statusText}`);
            }
            const data = await response.json();
            // Sort reports by createdAt date in descending order (latest first)
            const sortedReports = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setReports(sortedReports);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            console.error('Error fetching reports:', err);
        }
        finally {
            setLoading(false);
        }
    };
    // Download a report
    const downloadReport = async (reportId) => {
        if (!token)
            return false;
        try {
            const report = reports.find(r => r.id === reportId);
            if (!report) {
                throw new Error('Report not found');
            }
            // Extract filename from pdfUrl
            const filename = report.pdfUrl.split('/').pop();
            if (!filename) {
                throw new Error('Invalid PDF URL');
            }
            // Create a download URL
            const downloadUrl = `${import.meta.env.VITE_API_URL}/api/reports/download/${filename}`;
            // Make a fetch request with the authorization header
            const response = await fetch(downloadUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error downloading report: ${response.statusText}`);
            }
            // Get the blob from the response
            const blob = await response.blob();
            // Create a blob URL
            const blobUrl = URL.createObjectURL(blob);
            // Create a temporary anchor element and trigger download
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            // Clean up
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
            return true;
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            console.error('Error downloading report:', err);
            return false;
        }
    };
    // Delete a report
    const deleteReport = async (reportId) => {
        if (!token)
            return false;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/${reportId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error deleting report: ${response.statusText}`);
            }
            setReports(prev => prev.filter(r => r.id !== reportId));
            return true;
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            console.error('Error deleting report:', err);
            return false;
        }
    };
    // Fetch reports when the component mounts or token changes
    useEffect(() => {
        if (token) {
            fetchReports();
        }
        else {
            setReports([]);
            setLoading(false);
        }
    }, [token]);
    return {
        reports,
        loading,
        error,
        fetchReports,
        downloadReport,
        deleteReport
    };
};
