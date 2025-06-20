import { Link } from 'react-router-dom';
import { useAuthStore } from '@/context/authStore';

const DashboardPage = () => {
  const { user } = useAuthStore();
  
  // Debug log
  console.log('[DashboardPage] Component loaded at:', new Date().toISOString());
  console.log('[DashboardPage] Current path:', window.location.pathname);

  return (
    <div>
      {/* DEPLOYMENT TEST BANNER */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg mb-6 animate-pulse">
        <h1 className="text-2xl font-bold">🚀 DEPLOYMENT TEST - {new Date().toLocaleString()}</h1>
        <p className="text-sm">Version: 2025-06-20 15:10 UTC - Report generation improvements active!</p>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Welcome, {user?.name || 'User'}</h2>
        <Link to="/dashboard/people/new" className="btn bg-secondary-dark text-white hover:bg-secondary-light">
          + Add Person
        </Link>
      </div>
      
      <h3 className="text-xl font-bold mb-4 text-secondary-dark">Report Types</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Children's Life Report Card */}
        <div className="card hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold mb-2 text-primary-dark">Children's Life Report</h3>
          <p className="text-secondary mb-4">
            A specialized report designed for children, providing insights into their development, learning style, and natural talents based on their birth card.
          </p>
          <Link to="/dashboard/reports/childrens-life" className="btn bg-primary text-white hover:bg-primary-light">
            Create Report
          </Link>
        </div>
        
        {/* Report Type Cards */}
        <div className="card hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold mb-2">Yearly Report</h3>
          <p className="text-secondary mb-4">
            A detailed analysis of a person's upcoming year based on their birth card and current age. Includes yearly influences, key dates, and recommendations.
          </p>
          <Link to="/dashboard/reports/yearly" className="btn bg-secondary-dark text-white hover:bg-secondary-light">
            Create Report
          </Link>
        </div>
        
        <div className="card hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold mb-2">Life Report</h3>
          <p className="text-secondary mb-4">
            A comprehensive life analysis based on a person's birth card. Reveals life patterns, strengths, challenges, and long-term influences throughout their life journey.
          </p>
          <Link to="/dashboard/reports/life" className="btn bg-secondary-dark text-white hover:bg-secondary-light">
            Create Report
          </Link>
        </div>
        
        <div className="card hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold mb-2">Relationship Report</h3>
          <p className="text-secondary mb-4">
            Analyze the compatibility and dynamics between two people. Reveals relationship strengths, challenges, and provides insights into how to navigate the connection.
          </p>
          <Link to="/dashboard/reports/relationship" className="btn bg-secondary-dark text-white hover:bg-secondary-light">
            Create Report
          </Link>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-secondary-dark">Quick Links</h3>
        <Link to="/dashboard/reports" className="text-secondary-dark hover:text-secondary-light">
          View Report History →
        </Link>
      </div>
      
      {/* Admin Section - Only visible to admins */}
      {user?.isAdmin && (
        <>
          <h3 className="text-xl font-bold mb-4 mt-8 text-secondary-dark">Admin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/dashboard/admin/users" className="card hover:shadow-lg transition-shadow p-4 flex items-center">
              <span className="text-lg font-medium">User Management</span>
            </Link>
            <Link to="/dashboard/admin/settings" className="card hover:shadow-lg transition-shadow p-4 flex items-center">
              <span className="text-lg font-medium">System Settings</span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
// Force rebuild: ${Date.now()}
