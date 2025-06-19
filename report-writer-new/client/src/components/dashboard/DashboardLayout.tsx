import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopNavBar from './TopNavBar';
import Sidebar from './Sidebar';
import Footer from './Footer';

/**
 * DashboardLayout component
 * 
 * This component provides the layout structure for the dashboard,
 * including the top navigation bar, sidebar, main content area, and footer.
 */
const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Ensure logo is loaded properly
  useEffect(() => {
    // Preload the logo image
    const img = new Image();
    img.src = '/assets/logo.png';
    img.onload = () => console.log('Logo loaded successfully from /assets/logo.png');
    img.onerror = () => {
      console.error('Error loading logo from /assets/logo.png, trying fallback');
      const fallbackImg = new Image();
      fallbackImg.src = '/logo.png';
      fallbackImg.onload = () => console.log('Logo loaded successfully from fallback /logo.png');
      fallbackImg.onerror = () => console.error('Error loading logo from fallback path');
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <TopNavBar onMenuToggle={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full pt-16 md:pl-64">
        <div className="bg-red-600 text-white p-4 text-center font-bold text-xl">
          THIS IS THE ACTIVE VERSION - TIMESTAMP: 11:32 AM
        </div>
        <main className="flex-grow p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
