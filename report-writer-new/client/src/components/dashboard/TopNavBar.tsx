import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';

interface TopNavBarProps {
  onMenuToggle: () => void;
}

/**
 * TopNavBar component for the dashboard layout
 * 
 * This component displays the top navigation bar with logo, user menu,
 * notifications icon, and help button.
 */
const TopNavBar: React.FC<TopNavBarProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuthStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/logo.png');

  // Try different paths for the logo if the default one fails
  const handleLogoError = () => {
    console.error('Logo failed to load from', logoSrc);
    if (logoSrc === '/logo.png') {
      setLogoSrc('/assets/logo.png');
    } else if (logoSrc === '/assets/logo.png') {
      setLogoSrc('../logo.png');
    } else if (logoSrc === '../logo.png') {
      setLogoSrc('../../logo.png');
    } else if (logoSrc === '../../logo.png') {
      setLogoSrc('../../../logo.png');
    } else {
      console.error('Could not load logo from any path');
      // Use an inline SVG as fallback
      setLogoSrc('');
    }
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            {/* Mobile hamburger button */}
            <button
              type="button"
              onClick={onMenuToggle}
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>

            {/* Logo */}
            <Link to="/dashboard" className="flex ml-2 md:mr-24 items-center">
              {logoSrc ? (
                <img 
                  src={logoSrc} 
                  alt="Report Writer Logo" 
                  className="h-8 mr-2 block" 
                  style={{ 
                    display: 'block', 
                    visibility: 'visible',
                    width: 'auto',
                    maxWidth: '100%'
                  }}
                  onError={handleLogoError}
                  onLoad={() => console.log('Logo loaded in TopNavBar from', logoSrc)}
                />
              ) : (
                // Fallback SVG logo
                <svg 
                  className="h-8 w-8 mr-2" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              )}
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-primary">
                Report Writer
              </span>
            </Link>
          </div>

          <div className="flex items-center">
            {/* Notifications icon - for future feature */}
            <button
              type="button"
              className="p-2 mr-3 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <span className="sr-only">View notifications</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                ></path>
              </svg>
            </button>

            {/* Help button */}
            <button
              type="button"
              className="p-2 mr-3 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <span className="sr-only">Get help</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                type="button"
                onClick={toggleUserMenu}
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
                id="user-menu-button"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white">
                  {user?.username?.charAt(0) || 'U'}
                </div>
              </button>

              {/* Dropdown menu */}
              {userMenuOpen && (
                <div
                  className="absolute right-0 z-50 my-2 text-base list-none bg-white divide-y divide-gray-100 rounded shadow"
                  id="user-dropdown"
                >
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900">
                      {user?.username || 'User'}
                    </span>
                    <span className="block text-sm font-medium text-gray-500 truncate">
                      User Account
                    </span>
                  </div>
                  <ul className="py-1" aria-labelledby="user-menu-button">
                    <li>
                      <Link
                        to="/dashboard/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;
