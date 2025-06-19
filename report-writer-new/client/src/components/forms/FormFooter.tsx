import React, { ReactNode } from 'react';

interface FormFooterProps {
  primaryButton: ReactNode;
  secondaryButton?: ReactNode;
  tertiaryButton?: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
  sticky?: boolean;
}

/**
 * FormFooter component
 * 
 * This component provides a consistent footer for forms with primary, secondary,
 * and tertiary buttons. It can be sticky to the bottom of the form for better UX.
 */
const FormFooter: React.FC<FormFooterProps> = ({
  primaryButton,
  secondaryButton,
  tertiaryButton,
  className = '',
  align = 'between',
  sticky = false
}) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div 
      className={`
        mt-8 pt-4 border-t border-gray-200
        ${sticky ? 'sticky bottom-0 bg-white py-4 px-6 -mx-6 -mb-6 shadow-md' : ''}
        ${className}
      `}
    >
      <div className={`flex flex-wrap items-center gap-3 ${alignmentClasses[align]}`}>
        {align === 'between' && tertiaryButton && (
          <div className="order-1">{tertiaryButton}</div>
        )}
        
        {align === 'between' ? (
          <div className="order-2 flex items-center gap-3">
            {secondaryButton}
            {primaryButton}
          </div>
        ) : (
          <>
            {tertiaryButton && <div>{tertiaryButton}</div>}
            {secondaryButton && <div>{secondaryButton}</div>}
            <div>{primaryButton}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default FormFooter;
