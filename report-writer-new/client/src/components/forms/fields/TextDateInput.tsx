import React, { useState, useEffect } from 'react';
import { toISODateString, toDisplayDateString } from '../../../utils/dateUtils';

interface TextDateInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-describedby'?: string;
}

/**
 * TextDateInput component
 * 
 * A simple text input for dates in MM/DD/YYYY format.
 * It handles conversion between display format (MM/DD/YYYY) and ISO format (YYYY-MM-DD).
 */
const TextDateInput: React.FC<TextDateInputProps> = ({
  value,
  onChange,
  id,
  placeholder = 'MM/DD/YYYY',
  disabled = false,
  required = false,
  className = '',
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedby
}) => {
  const [displayValue, setDisplayValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const inputId = id || `date-input-${Math.random().toString(36).substring(2, 9)}`;

  // Update display value when value prop changes
  useEffect(() => {
    if (value) {
      try {
        const displayDate = toDisplayDateString(value);
        setDisplayValue(displayDate);
      } catch (error) {
        console.error('Error converting date:', error);
        setDisplayValue(value);
      }
    } else {
      setDisplayValue('');
    }
  }, [value]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
  };

  // Handle blur (when input loses focus)
  const handleBlur = () => {
    if (!displayValue) {
      onChange('');
      setError(null);
      return;
    }

    try {
      // Convert to ISO format (YYYY-MM-DD)
      const isoDate = toISODateString(displayValue);
      
      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(isoDate)) {
        setError('Date must be in MM/DD/YYYY format');
        return;
      }
      
      // Update with the ISO date
      onChange(isoDate);
      
      // Format back to MM/DD/YYYY for display
      const formattedDate = toDisplayDateString(isoDate);
      setDisplayValue(formattedDate);
      setError(null);
    } catch (error) {
      console.error('Error converting date:', error);
      setError('Invalid date format. Please use MM/DD/YYYY format');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        id={inputId}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full px-3 py-2 text-base
          border rounded-md shadow-sm
          focus:outline-none focus:ring-1
          ${ariaInvalid === true || ariaInvalid === 'true' || error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
        aria-invalid={ariaInvalid || (error ? 'true' : 'false')}
        aria-describedby={ariaDescribedby}
      />

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default TextDateInput;
