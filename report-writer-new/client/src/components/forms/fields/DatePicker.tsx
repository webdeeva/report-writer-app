import React, { useState, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import { parseDate, formatDate, toISODateString } from '../../../utils/dateUtils';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  minDate?: string;
  maxDate?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-describedby'?: string;
}

/**
 * DatePicker component
 * 
 * A date picker component using react-datepicker.
 * It supports date validation and formatting.
 */
const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  id,
  placeholder = 'Select date',
  disabled = false,
  required = false,
  className = '',
  minDate,
  maxDate,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedby
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    return value ? parseDate(value) : null;
  });
  const [error, setError] = useState<string | null>(null);
  const datePickerId = id || `datepicker-${Math.random().toString(36).substring(2, 9)}`;

  // Update selected date when value prop changes
  useEffect(() => {
    if (value) {
      const date = parseDate(value);
      setSelectedDate(date);
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  // Validate date
  const validateDate = (date: Date | null): boolean => {
    if (!date) return true;
    
    if (minDate && date < parseDate(minDate)!) {
      setError(`Date must be after ${formatDate(minDate)}`);
      return false;
    }

    if (maxDate && date > parseDate(maxDate)!) {
      setError(`Date must be before ${formatDate(maxDate)}`);
      return false;
    }

    setError(null);
    return true;
  };

  // Handle date change
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    
    if (!date) {
      onChange('');
      setError(null);
      return;
    }

    if (validateDate(date)) {
      // Convert to ISO format (YYYY-MM-DD)
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const isoDate = `${year}-${month}-${day}`;
      onChange(isoDate);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* React DatePicker */}
      <ReactDatePicker
        id={datePickerId}
        selected={selectedDate}
        onChange={handleDateChange}
        placeholderText={placeholder}
        disabled={disabled}
        required={required}
        minDate={minDate ? parseDate(minDate) || undefined : undefined}
        maxDate={maxDate ? parseDate(maxDate) || undefined : undefined}
        dateFormat="MM/dd/yyyy"
        className={`
          w-full px-3 py-2 text-base
          border rounded-md shadow-sm pr-10
          focus:outline-none focus:ring-1
          ${ariaInvalid === true || ariaInvalid === 'true' || error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer'}
        `}
        aria-invalid={ariaInvalid || (error ? 'true' : 'false')}
        aria-describedby={ariaDescribedby}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        todayButton="Today"
        isClearable
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

export default DatePicker;
