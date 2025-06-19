import { useState } from 'react';
import { useReports } from '@/hooks/useReports';
import { FormLayout, FormHeader } from '@/components/forms';

const ReportHistoryPage = () => {
  const { reports, loading, error, downloadReport, deleteReport } = useReports();
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  
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
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
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
