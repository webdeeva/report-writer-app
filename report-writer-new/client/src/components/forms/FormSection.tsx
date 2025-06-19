import React, { ReactNode, useState } from 'react';

interface FormSectionProps {
  title: string;
  description?: string | ReactNode;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
  collapsible?: boolean;
}

/**
 * FormSection component
 * 
 * This component provides a section within a form with a title, optional description,
 * and content. It can be collapsible for better organization of complex forms.
 */
const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className = '',
  defaultOpen = true,
  collapsible = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleSection = () => {
    if (collapsible) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`mb-8 ${className}`}>
      <div 
        className={`flex items-center ${collapsible ? 'cursor-pointer' : ''}`}
        onClick={toggleSection}
      >
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        
        {collapsible && (
          <button 
            type="button"
            className="ml-auto text-gray-500 focus:outline-none"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Collapse section' : 'Expand section'}
          >
            <svg 
              className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          </button>
        )}
      </div>
      
      {description && (
        <div className="mt-1 text-sm text-gray-500">
          {typeof description === 'string' ? (
            <p>{description}</p>
          ) : (
            description
          )}
        </div>
      )}
      
      {(!collapsible || isOpen) && (
        <div className="mt-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default FormSection;
