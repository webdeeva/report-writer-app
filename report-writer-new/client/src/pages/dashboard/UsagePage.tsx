import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/context/authStore';

interface UsageData {
  totalReports: number;
  totalTokens: number;
  totalCost: number;
  reportLimit: number | null;
  remainingReports: number | null;
  canGenerate: boolean;
}

interface ReportUsage {
  id: number;
  type: string;
  person1Name: string;
  person2Name?: string | null;
  tokensUsed: number;
  cost: number;
  createdAt: string;
}

const UsagePage = () => {
  const { user } = useAuthStore();
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [reports, setReports] = useState<ReportUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch usage data
  const fetchUsageData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/usage');
      setUsageData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch usage data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reports
  const fetchReports = async () => {
    try {
      const response = await axios.get('/api/reports');
      setReports(response.data);
    } catch (err) {
      console.error('Failed to fetch reports', err);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchUsageData();
    fetchReports();
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="text-center py-4">Loading usage data...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Usage Statistics</h2>
      
      {usageData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-2">Reports Generated</h3>
            <div className="text-4xl font-bold text-secondary-dark mb-2">
              {usageData.totalReports}
              {usageData.reportLimit !== null && (
                <span className="text-lg text-secondary ml-2">
                  of {usageData.reportLimit}
                </span>
              )}
            </div>
            {usageData.reportLimit !== null && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-secondary-dark h-2.5 rounded-full" 
                  style={{ width: `${Math.min(100, (usageData.totalReports / usageData.reportLimit) * 100)}%` }}
                ></div>
              </div>
            )}
            {usageData.remainingReports !== null && (
              <p className="text-secondary">
                {usageData.remainingReports} reports remaining
              </p>
            )}
          </div>
          
          <div className="card hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-2">Tokens Used</h3>
            <div className="text-4xl font-bold text-secondary-dark mb-2">
              {usageData.totalTokens.toLocaleString()}
            </div>
            <p className="text-secondary">
              Tokens are used to generate report content
            </p>
          </div>
          
          <div className="card hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-2">Total Cost</h3>
            <div className="text-4xl font-bold text-secondary-dark mb-2">
              {formatCurrency(usageData.totalCost)}
            </div>
            <p className="text-secondary">
              Cost is calculated based on tokens used
            </p>
          </div>
        </div>
      )}
      
      <h3 className="text-xl font-bold mb-4">Report History</h3>
      
      {reports.length === 0 ? (
        <div className="text-center py-4 text-secondary">
          No reports generated yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Date</th>
                <th className="border p-2 text-left">Report Type</th>
                <th className="border p-2 text-left">Person</th>
                <th className="border p-2 text-left">Tokens Used</th>
                <th className="border p-2 text-left">Cost</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="border p-2">{formatDate(report.createdAt)}</td>
                  <td className="border p-2">
                    {report.type === 'yearly' && 'Yearly Report'}
                    {report.type === 'life' && 'Life Report'}
                    {report.type === 'relationship' && 'Relationship Report'}
                  </td>
                  <td className="border p-2">
                    {report.person1Name}
                    {report.person2Name && ` & ${report.person2Name}`}
                  </td>
                  <td className="border p-2">{report.tokensUsed.toLocaleString()}</td>
                  <td className="border p-2">{formatCurrency(report.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsagePage;
