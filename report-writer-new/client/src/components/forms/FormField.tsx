import React, { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
  helpText?: string | ReactNode;
}

/**
 * FormField component
 * 
 * This component provides a consistent layout for form fields, including
 * label, input element, error message, and optional help text.
 */
const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  error,
  required = false,
  className = '',
  children,
  helpText
}) => {
  const id = htmlFor || Math.random().toString(36).substring(2, 9);
  const errorId = `${id}-error`;
  const helpTextId = `${id}-help`;

  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex justify-between items-baseline mb-1">
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      
      <div className="mt-1">
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement, {
              id,
              'aria-invalid': error ? 'true' : 'false',
              'aria-describedby': error 
                ? errorId 
                : helpText 
                  ? helpTextId 
                  : undefined,
            })
          : children}
      </div>
      
      {helpText && !error && (
        <p 
          id={helpTextId} 
          className="mt-1 text-sm text-gray-500"
        >
          {helpText}
        </p>
      )}
      
      {error && (
        <p 
          id={errorId} 
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
