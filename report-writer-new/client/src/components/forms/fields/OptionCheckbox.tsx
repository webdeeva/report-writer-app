import React from 'react';

interface OptionCheckboxProps {
  id?: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-describedby'?: string;
}

/**
 * OptionCheckbox component
 * 
 * A styled checkbox component for selecting report options.
 * It includes a label and optional description.
 */
const OptionCheckbox: React.FC<OptionCheckboxProps> = ({
  id,
  label,
  description,
  checked,
  onChange,
  disabled = false,
  className = '',
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedby
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className={`relative flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={`
            h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500
            ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
            ${ariaInvalid === true || ariaInvalid === 'true' ? 'border-red-300' : ''}
          `}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedby}
        />
      </div>
      <div className="ml-3 text-sm">
        <label 
          htmlFor={checkboxId} 
          className={`font-medium text-gray-700 ${disabled ? 'opacity-60' : ''} ${!description ? 'cursor-pointer' : ''}`}
        >
          {label}
        </label>
        {description && (
          <p className="text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
};

export default OptionCheckbox;
