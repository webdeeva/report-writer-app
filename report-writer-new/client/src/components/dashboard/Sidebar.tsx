import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Sidebar component for the dashboard layout
 * 
 * This component displays the sidebar navigation with links to different
 * sections of the application.
 */
const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuthStore();
  const isAdmin = user?.isAdmin === true;

  // Helper function to check if a path is active
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  // NavItem component for sidebar navigation items
  const NavItem = ({ 
    to, 
    icon, 
    label 
  }: { 
    to: string; 
    icon: React.ReactNode; 
    label: string;
  }) => {
    const active = isActive(to);
    
    return (
      <li>
        <NavLink
          to={to}
          className={`flex items-center p-2 text-base font-normal rounded-lg group ${
            active
              ? 'bg-primary text-white'
              : 'text-gray-900 hover:bg-gray-100'
          }`}
          onClick={() => {
            if (window.innerWidth < 768) {
              onClose();
            }
          }}
        >
          {icon}
          <span className="ml-3">{label}</span>
        </NavLink>
      </li>
    );
  };

  // NavSection component for grouped navigation items
  const NavSection = ({ 
    title, 
    children 
  }: { 
    title: string; 
    children: React.ReactNode;
  }) => {
    return (
      <div className="pt-4 pb-2">
        <div className="flex items-center p-2">
          <span className="text-sm font-semibold uppercase text-gray-500">
            {title}
          </span>
        </div>
        <ul className="space-y-1">{children}</ul>
      </div>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r border-gray-200 md:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
          {/* Logo */}
          <div className="flex justify-center py-4">
            <img 
              src="/assets/logo.png" 
              alt="Report Writer Logo" 
              className="h-16 w-auto" 
              style={{ 
                display: 'block',
                visibility: 'visible',
                opacity: 1
              }}
              onError={(e) => {
                console.error('Logo failed to load in Sidebar');
                // Try alternative path
                if (e.currentTarget.src.includes('/assets/logo.png')) {
                  e.currentTarget.src = '/logo.png';
                } else {
                  // If all paths fail, hide the image
                  e.currentTarget.style.display = 'none';
                }
              }}
              onLoad={() => console.log('Logo loaded in Sidebar')}
            />
          </div>
          
          <ul className="space-y-2 pt-2">
            {/* Dashboard */}
            <NavItem
              to="/dashboard"
              icon={
                <svg
                  className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                </svg>
              }
              label="Dashboard"
            />
          </ul>

          {/* People section */}
          <NavSection title="People">
            <NavItem
              to="/dashboard/people"
              icon={
                <svg
                  className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              }
              label="People List"
            />
            <NavItem
              to="/dashboard/people/new"
              icon={
                <svg
                  className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              }
              label="Add Person"
            />
          </NavSection>

          {/* Reports section */}
          <NavSection title="Reports">
            {/* Children's Life Report - NEW */}
            <NavItem
              to="/dashboard/reports/childrens-life"
              icon={
                <svg
                  className="w-6 h-6 text-blue-500 transition duration-75 group-hover:text-blue-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              }
              label="Children's Life Report ✨"
            />
            <NavItem
              to="/dashboard/reports/yearly"
              icon={
                <svg
                  className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              }
              label="Yearly Report"
            />
            <NavItem
              to="/dashboard/reports/life"
              icon={
                <svg
                  className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              }
              label="Life Report"
            />
            <NavItem
              to="/dashboard/reports/relationship"
              icon={
                <svg
                  className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              }
              label="Relationship Report"
            />
            <NavItem
              to="/dashboard/reports/financial"
              icon={
                <svg
                  className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              }
              label="Financial Report"
            />
            {/* Singles Report */}
            <NavItem
              to="/dashboard/reports/singles"
              icon={
                <svg
                  className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              }
              label="Singles Report"
            />
            {/* Children's Life Report - UPDATED */}
            <NavItem
              to="/dashboard/reports/childrens-life"
              icon={
                <svg
                  className="w-6 h-6 text-blue-500 transition duration-75 group-hover:text-blue-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              }
              label="Children's Life Report ✨"
            />
          </NavSection>

          {/* Other navigation items */}
          <ul className="pt-4 mt-4 space-y-2 border-t border-gray-200">
            <NavItem
              to="/dashboard/reports"
              icon={
                <svg
                  className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9 1a1 1 0 00-1 1v6a1 1 0 002 0V7a1 1 0 00-1-1zm-5 1a1 1 0 00-1 1v6a1 1 0 002 0V7a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              }
              label="Report History"
            />
            {(user?.isPremium || user?.isAdmin) && (
              <NavItem
                to="/dashboard/settings"
                icon={
                  <svg
                    className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                }
                label="Settings"
              />
            )}

            {/* Admin section (conditional) */}
            {isAdmin && (
              <>
                <NavItem
                  to="/dashboard/admin/users"
                  icon={
                    <svg
                      className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  }
                  label="User Management"
                />
                <NavItem
                  to="/dashboard/admin/settings"
                  icon={
                    <svg
                      className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  }
                  label="Admin Settings"
                />
              </>
            )}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
