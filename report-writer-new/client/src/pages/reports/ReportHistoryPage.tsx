import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useReports } from '@/hooks/useReports';
import { FormLayout, FormHeader } from '@/components/forms';

const ReportHistoryPage = () => {
  const { reports, loading, error: hookError, downloadReport, deleteReport, fetchReports } = useReports();
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const location = useLocation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingMessage, setGeneratingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Check for navigation state
  useEffect(() => {
    if (location.state) {
      const { generating, personName, reportType, error: navError } = location.state as any;
      
      if (generating) {
        setIsGenerating(true);
        setGeneratingMessage(`Generating ${reportType || 'report'} for ${personName || 'selected person'}...`);
        
        // Auto-refresh reports every 3 seconds while generating
        const interval = setInterval(() => {
          fetchReports();
        }, 3000);
        
        // Stop refreshing after 30 seconds
        const timeout = setTimeout(() => {
          clearInterval(interval);
          setIsGenerating(false);
          setGeneratingMessage('');
        }, 30000);
        
        return () => {
          clearInterval(interval);
          clearTimeout(timeout);
        };
      }
      
      if (navError) {
        setError(navError);
        setIsGenerating(false);
      }
      
      // Clear location state
      window.history.replaceState({}, document.title);
    }
  }, [location, fetchReports]);
  
  const handleDownload = async (reportId: number) => {
    await downloadReport(reportId);
  };
  
  const handleDelete = async (reportId: number) => {
    if (await deleteReport(reportId)) {
      setDeleteConfirmId(null);
    }
  };
  
  const getReportTypeLabel = (type: string) => {
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
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  
  return (
    <FormLayout>
      <FormHeader 
        title="Report History" 
        description="View and download your previously generated reports."
      />
      
      {(error || hookError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error || hookError}</span>
        </div>
      )}
      
      {isGenerating && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded relative mb-6" role="status">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700 mr-3"></div>
            <span>{generatingMessage}</span>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-secondary mb-4">You haven't generated any reports yet.</p>
          <p className="text-sm text-secondary">
            Go to the dashboard to generate your first report.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium">Your Reports</h3>
            <p className="text-sm text-secondary">
              View and download your previously generated reports.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-dark uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-dark uppercase tracking-wider">
                    Person(s)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-dark uppercase tracking-wider">
                    Date Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-dark uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map(report => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-secondary-dark">
                        {getReportTypeLabel(report.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-secondary">
                        {report.type === 'relationship' && report.person2Name
                          ? `${report.person1Name} & ${report.person2Name}` 
                          : report.person1Name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-secondary">
                        {formatDate(report.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {deleteConfirmId === report.id ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDelete(report.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button
                            onClick={() => handleDownload(report.id)}
                            className="text-primary hover:text-primary-light mr-4"
                          >
                            Download
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(report.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </FormLayout>
  );
};

export default ReportHistoryPage;
