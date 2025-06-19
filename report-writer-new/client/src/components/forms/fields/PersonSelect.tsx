import React, { useState, useEffect, useRef } from 'react';
import { usePeople, Person } from '@/hooks/usePeople';

interface PersonSelectProps {
  value: number | null;
  onChange: (personId: number | null) => void;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-describedby'?: string;
}

/**
 * PersonSelect component
 * 
 * A searchable dropdown component for selecting a person from the user's list of people.
 * It fetches the list of people using the usePeople hook and provides search functionality.
 */
const PersonSelect: React.FC<PersonSelectProps> = ({
  value,
  onChange,
  id,
  placeholder = 'Select a person',
  disabled = false,
  required = false,
  className = '',
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedby
}) => {
  const { people, loading, error } = usePeople();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find the selected person when value changes or people are loaded
  useEffect(() => {
    if (value && people.length > 0) {
      const person = people.find((p: Person) => p.id === value) || null;
      setSelectedPerson(person);
    } else {
      setSelectedPerson(null);
    }
  }, [value, people]);

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

  // Filter people based on search term
  const filteredPeople = people.filter((person: Person) => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle person selection
  const handleSelectPerson = (person: Person) => {
    onChange(person.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Clear selection
  const handleClear = () => {
    onChange(null);
    setSearchTerm('');
  };

  // Format date for display
  const formatDate = (dateString: string, originalFormat?: string) => {
    // Check if it's in MM/DD/YYYY format
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
      return dateString;
    }
    
    // For YYYY-MM-DD format, convert to MM/DD/YYYY
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-');
      return `${month}/${day}/${year}`;
    }
    
    // For ISO format with time, extract just the date part and convert
    if (dateString.includes('T')) {
      const datePart = dateString.split('T')[0];
      const [year, month, day] = datePart.split('-');
      return `${month}/${day}/${year}`;
    }
    
    // Fallback to standard formatting
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  return (
    <div 
      className={`relative ${className}`} 
      ref={dropdownRef}
    >
      {/* Selected person display or search input */}
      <div 
        className={`
          flex items-center justify-between w-full px-3 py-2 text-base
          border rounded-md shadow-sm focus-within:ring-1
          ${ariaInvalid === true || ariaInvalid === 'true'
            ? 'border-red-300 focus-within:ring-red-500 focus-within:border-red-500'
            : 'border-gray-300 focus-within:ring-indigo-500 focus-within:border-indigo-500'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer'}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full border-none focus:outline-none focus:ring-0 p-0"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsOpen(false);
              }
            }}
            autoFocus
          />
        ) : (
          <div className="flex-1 truncate">
            {selectedPerson ? (
              <div className="flex items-center">
                <span className="font-medium">{selectedPerson.name}</span>
                <span className="ml-2 text-sm text-gray-500">
                  {formatDate(selectedPerson.birthdate, selectedPerson.originalDateFormat)}
                </span>
              </div>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
        )}

        <div className="flex items-center">
          {selectedPerson && !isOpen && (
            <button
              type="button"
              className="p-1 text-gray-400 hover:text-gray-500"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              aria-label="Clear selection"
            >
              <svg 
                className="w-4 h-4" 
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
          
          <button
            type="button"
            className="p-1 ml-1 text-gray-400"
            aria-label={isOpen ? 'Close dropdown' : 'Open dropdown'}
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) setIsOpen(!isOpen);
            }}
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
        </div>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
          ) : error ? (
            <div className="px-4 py-2 text-sm text-red-500">Error loading people</div>
          ) : filteredPeople.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              {searchTerm ? 'No matching people found' : 'No people available'}
            </div>
          ) : (
            <ul className="py-1">
              {filteredPeople.map((person: Person) => (
                <li 
                  key={person.id}
                  className={`
                    px-4 py-2 text-sm cursor-pointer hover:bg-gray-100
                    ${person.id === value ? 'bg-indigo-50 text-indigo-700' : 'text-gray-900'}
                  `}
                  onClick={() => handleSelectPerson(person)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{person.name}</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(person.birthdate, person.originalDateFormat)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonSelect;
