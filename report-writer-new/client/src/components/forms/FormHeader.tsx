import React, { ReactNode } from 'react';

interface FormHeaderProps {
  title: string;
  description?: string | ReactNode;
  className?: string;
}

/**
 * FormHeader component
 * 
 * This component displays the title and optional description at the top of a form.
 * It provides consistent styling and structure for all form headers.
 */
const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  description,
  className = ''
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      {description && (
        <div className="mt-2 text-gray-600">
          {typeof description === 'string' ? (
            <p>{description}</p>
          ) : (
            description
          )}
        </div>
      )}
      <div className="mt-4 border-b border-gray-200"></div>
    </div>
  );
};

export default FormHeader;
