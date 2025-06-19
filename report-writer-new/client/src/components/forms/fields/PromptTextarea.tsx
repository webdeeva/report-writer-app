import React, { useState, useEffect } from 'react';

interface PromptTextareaProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  maxLength?: number;
  minRows?: number;
  maxRows?: number;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-describedby'?: string;
}

/**
 * PromptTextarea component
 * 
 * A textarea component for entering analysis prompts with character count.
 * It automatically resizes based on content and shows a character counter.
 */
const PromptTextarea: React.FC<PromptTextareaProps> = ({
  value,
  onChange,
  id,
  placeholder = 'Enter your prompt...',
  maxLength = 2000,
  minRows = 4,
  maxRows = 12,
  disabled = false,
  required = false,
  className = '',
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedby
}) => {
  const [rows, setRows] = useState(minRows);
  const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;
  const counterColor = value.length > maxLength * 0.9 
    ? value.length > maxLength 
      ? 'text-red-500' 
      : 'text-amber-500' 
    : 'text-gray-500';

  // Adjust rows based on content
  useEffect(() => {
    const lineCount = (value.match(/\n/g) || []).length + 1;
    const newRows = Math.min(Math.max(lineCount, minRows), maxRows);
    setRows(newRows);
  }, [value, minRows, maxRows]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      <textarea
        id={textareaId}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        required={required}
        className={`
          w-full px-3 py-2 text-base
          border rounded-md shadow-sm resize-none
          focus:outline-none focus:ring-2
          ${ariaInvalid === true || ariaInvalid === 'true' || value.length > maxLength
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
        aria-invalid={ariaInvalid || (value.length > maxLength ? 'true' : 'false')}
        aria-describedby={ariaDescribedby}
      />
      
      {/* Character counter */}
      <div className={`mt-1 text-sm flex justify-end ${counterColor}`}>
        <span>{value.length}</span>
        <span className="mx-1">/</span>
        <span>{maxLength}</span>
        <span className="ml-1">characters</span>
      </div>
      
      {/* Error message for exceeding max length */}
      {value.length > maxLength && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          Character limit exceeded by {value.length - maxLength} characters
        </p>
      )}
    </div>
  );
};

export default PromptTextarea;
