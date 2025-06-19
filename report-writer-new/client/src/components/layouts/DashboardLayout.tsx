import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/context/authStore';

/**
 * Layout for dashboard pages with navigation
 */
const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background-alt">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/assets/logo.png" 
              alt="Report Writer Logo" 
              className="h-10 mr-3 block" 
              style={{ 
                display: 'block',
                visibility: 'visible',
                width: 'auto',
                maxWidth: '100%',
                opacity: 1,
                position: 'static'
              }}
              onError={(e) => {
                console.error('Logo failed to load in DashboardLayout');
                // Try alternative paths
                if (e.currentTarget.src.includes('/assets/logo.png')) {
                  e.currentTarget.src = '/logo.png';
                } else {
                  // If all paths fail, hide the image
                  e.currentTarget.style.display = 'none';
                }
              }}
              onLoad={() => console.log('Logo loaded in DashboardLayout')}
            />
            <h1 className="text-2xl font-bold text-primary">
              {import.meta.env.VITE_APP_NAME || 'Report Writer'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-secondary">
              Welcome, {user?.username || 'User'}
            </span>
            <button
              onClick={handleLogout}
              className="btn bg-primary text-white hover:bg-primary-light text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) =>
                    `block p-2 rounded-md ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-secondary hover:bg-gray-100'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              
              <li>
                <NavLink
                  to="/dashboard/people"
                  className={({ isActive }) =>
                    `block p-2 rounded-md ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-secondary hover:bg-gray-100'
                    }`
                  }
                >
                  People
                </NavLink>
              </li>
              
              <li>
                <NavLink
                  to="/dashboard/usage"
                  className={({ isActive }) =>
                    `block p-2 rounded-md ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-secondary hover:bg-gray-100'
                    }`
                  }
                >
                  Usage & Billing
                </NavLink>
              </li>
              
              <li className="pt-2">
                <h3 className="font-medium text-secondary-dark px-2 py-1">
                  Reports
                </h3>
                <ul className="pl-2 space-y-1 mt-1">
                  <li>
                    <NavLink
                      to="/dashboard/reports/yearly"
                      className={({ isActive }) =>
                        `block p-2 rounded-md ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-secondary hover:bg-gray-100'
                        }`
                      }
                    >
                      Yearly Report
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/reports/life"
                      className={({ isActive }) =>
                        `block p-2 rounded-md ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-secondary hover:bg-gray-100'
                        }`
                      }
                    >
                      Life Report
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/reports/relationship"
                      className={({ isActive }) =>
                        `block p-2 rounded-md ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-secondary hover:bg-gray-100'
                        }`
                      }
                    >
                      Relationship Report
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/reports"
                      className={({ isActive }) =>
                        `block p-2 rounded-md ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-secondary hover:bg-gray-100'
                        }`
                      }
                    >
                      Report History
                    </NavLink>
                  </li>
                </ul>
              </li>
              
              {/* Admin section - only visible to admins */}
              {user?.isAdmin && (
                <li className="pt-2">
                  <h3 className="font-medium text-secondary-dark px-2 py-1">
                    Admin
                  </h3>
                  <ul className="pl-2 space-y-1 mt-1">
                    <li>
                      <NavLink
                        to="/dashboard/admin/users"
                        className={({ isActive }) =>
                          `block p-2 rounded-md ${
                            isActive
                              ? 'bg-primary text-white'
                              : 'text-secondary hover:bg-gray-100'
                          }`
                        }
                      >
                        User Management
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/dashboard/admin/settings"
                        className={({ isActive }) =>
                          `block p-2 rounded-md ${
                            isActive
                              ? 'bg-primary text-white'
                              : 'text-secondary hover:bg-gray-100'
                          }`
                        }
                      >
                        Settings
                      </NavLink>
                    </li>
                  </ul>
                </li>
              )}
            </ul>
          </nav>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
