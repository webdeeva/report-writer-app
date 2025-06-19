import React, { useState, useRef, useEffect } from 'react';

export interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-describedby'?: string;
}

/**
 * MultiSelect component
 * 
 * A component for selecting multiple options from a list.
 * It displays selected options as tags and provides a dropdown for selecting more options.
 */
const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  id,
  placeholder = 'Select options',
  disabled = false,
  className = '',
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedby
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectId = id || `multiselect-${Math.random().toString(36).substring(2, 9)}`;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter options based on search term and already selected values
  const filteredOptions = options.filter(
    option => 
      !value.includes(option.value) && 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected options with labels
  const selectedOptions = options.filter(option => value.includes(option.value));

  // Toggle option selection
  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  // Remove a selected option
  const removeOption = (optionValue: string) => {
    onChange(value.filter(v => v !== optionValue));
  };

  return (
    <div 
      className={`relative ${className}`} 
      ref={dropdownRef}
    >
      {/* Selected options and search input */}
      <div 
        className={`
          flex flex-wrap items-center w-full px-3 py-2 text-base
          border rounded-md shadow-sm min-h-[42px] focus-within:ring-1
          ${ariaInvalid === true || ariaInvalid === 'true'
            ? 'border-red-300 focus-within:ring-red-500 focus-within:border-red-500'
            : 'border-gray-300 focus-within:ring-indigo-500 focus-within:border-indigo-500'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer'}
        `}
        onClick={() => !disabled && setIsOpen(true)}
      >
        {/* Selected option tags */}
        {selectedOptions.length > 0 && (
          <div className="flex flex-wrap gap-1 mr-2">
            {selectedOptions.map(option => (
              <div 
                key={option.value}
                className="flex items-center bg-indigo-100 text-indigo-800 text-sm rounded-md px-2 py-1"
              >
                <span>{option.label}</span>
                {!disabled && (
                  <button
                    type="button"
                    className="ml-1 text-indigo-500 hover:text-indigo-700 focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOption(option.value);
                    }}
                    aria-label={`Remove ${option.label}`}
                  >
                    <svg 
                      className="w-3 h-3" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Search input */}
        {isOpen ? (
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={selectedOptions.length === 0 ? placeholder : ''}
            className="flex-grow border-none focus:outline-none focus:ring-0 p-0 min-w-[80px]"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsOpen(false);
              }
            }}
            autoFocus
          />
        ) : (
          selectedOptions.length === 0 && (
            <span className="text-gray-500">{placeholder}</span>
          )
        )}

        {/* Dropdown indicator */}
        <div className="ml-auto pl-2">
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
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
        </div>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              {searchTerm ? 'No matching options found' : 'No options available'}
            </div>
          ) : (
            <ul className="py-1">
              {filteredOptions.map(option => (
                <li 
                  key={option.value}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 text-gray-900"
                  onClick={() => {
                    toggleOption(option.value);
                    setSearchTerm('');
                  }}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
