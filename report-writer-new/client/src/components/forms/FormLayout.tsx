import React, { ReactNode } from 'react';

interface FormLayoutProps {
  children: ReactNode;
  className?: string;
  showPreview?: boolean;
  preview?: ReactNode;
}

/**
 * FormLayout component
 * 
 * This component provides the base layout structure for all forms in the application.
 * It supports an optional preview panel that can be shown alongside the form.
 */
const FormLayout: React.FC<FormLayoutProps> = ({
  children,
  className = '',
  showPreview = false,
  preview
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className={`flex flex-col lg:flex-row ${showPreview ? 'lg:space-x-6' : ''}`}>
        {/* Main form content */}
        <div className={`flex-1 bg-white rounded-lg shadow-md p-6 ${showPreview ? 'lg:w-3/5' : 'w-full'}`}>
          {children}
        </div>

        {/* Preview panel (conditional) */}
        {showPreview && preview && (
          <div className="lg:w-2/5 mt-6 lg:mt-0 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Preview</h3>
            <div className="preview-content">
              {preview}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormLayout;
