import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer component for the dashboard layout
 * 
 * This component displays the footer with copyright information,
 * version number, and links to terms of service, privacy policy, etc.
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const appVersion = '1.0.0'; // This could be imported from a config file

  return (
    <footer className="bg-white p-4 shadow md:flex md:items-center md:justify-between md:p-6 border-t border-gray-200">
      <div className="text-sm text-gray-500 sm:text-center">
        <span>© {currentYear} </span>
        <span className="font-semibold">Report Writer</span>
        <span>. All Rights Reserved.</span>
      </div>
      
      <div className="flex flex-wrap items-center mt-3 text-sm text-gray-500 sm:mt-0">
        <div>
          <span>Version {appVersion}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
