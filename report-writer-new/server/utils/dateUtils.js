/**
 * Utility functions for date operations using date-fns
 */

import { format } from 'date-fns';

/**
 * Parse a date string safely without timezone issues
 * @param {string} dateStr - Date string in various formats
 * @param {boolean} useLocal - Whether to use local time instead of UTC (default: false)
 * @returns {Date} Date object
 */
export const parseDate = (dateStr, useLocal = false) => {
  try {
    // For YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-').map(Number);
      // Create date using local time or UTC based on parameter
      return useLocal ? new Date(year, month - 1, day) : new Date(Date.UTC(year, month - 1, day));
    }
    
    // For MM/DD/YYYY format
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
      const [month, day, year] = dateStr.split('/').map(Number);
      // Create date using local time or UTC based on parameter
      return useLocal ? new Date(year, month - 1, day) : new Date(Date.UTC(year, month - 1, day));
    }
    
    // For ISO format with time
    if (dateStr.includes('T')) {
      const datePart = dateStr.split('T')[0];
      const [year, month, day] = datePart.split('-').map(Number);
      // Create date using local time or UTC based on parameter
      return useLocal ? new Date(year, month - 1, day) : new Date(Date.UTC(year, month - 1, day));
    }
    
    // Default fallback - try to parse as is
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    return date;
  } catch (error) {
    console.error('Error parsing date:', error);
    return new Date(); // Return current date as fallback
  }
};

/**
 * Calculate age based on birthdate
 * @param {string} birthdate - Birthdate string in ISO format (YYYY-MM-DD)
 * @returns {number} Age in years
 */
export const calculateAge = (birthdate) => {
  const today = new Date();
  let birthDate;
  
  // Handle string dates in YYYY-MM-DD format
  if (typeof birthdate === 'string') {
    // If it's an ISO string, extract just the date part
    if (birthdate.includes('T')) {
      const datePart = birthdate.split('T')[0];
      const [year, month, day] = datePart.split('-').map(Number);
      birthDate = new Date(Date.UTC(year, month - 1, day)); // Use UTC to avoid timezone issues
    } else {
      // If it's already a date string like YYYY-MM-DD
      const [year, month, day] = birthdate.split('-').map(Number);
      birthDate = new Date(Date.UTC(year, month - 1, day)); // Use UTC to avoid timezone issues
    }
  } else {
    // If it's already a Date object
    birthDate = birthdate;
  }
  
  // Calculate age based on year difference
  let age = today.getFullYear() - birthDate.getFullYear();
  
  // Adjust age if birthday hasn't occurred yet this year
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Format date to a readable string
 * @param {string} dateStr - Date string in various formats
 * @param {string} formatType - Format type ('short', 'medium', 'long')
 * @returns {string} Formatted date string
 */
export const formatDate = (dateStr, formatType = 'medium') => {
  const date = parseDate(dateStr);
  
  const formatPatterns = {
    short: 'MM/dd/yyyy',
    medium: 'MMM d, yyyy',
    long: 'MMMM d, yyyy'
  };
  
  return format(date, formatPatterns[formatType] || formatPatterns.medium);
};

/**
 * Get month and day from a date
 * @param {string} dateStr - Date string in various formats
 * @returns {string} Month/day string (e.g., "12/25")
 */
export const getMonthDay = (dateStr) => {
  const date = parseDate(dateStr);
  // Use UTC methods to avoid timezone shifts
  const month = date.getUTCMonth() + 1; // getMonth() returns 0-11
  const day = date.getUTCDate();
  
  return `${month}/${day}`;
};

/**
 * Convert MM/DD/YYYY to YYYY-MM-DD format
 * @param {string} dateStr - Date string in MM/DD/YYYY format
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const toISODateString = (dateStr) => {
  // If already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  // Convert MM/DD/YYYY to YYYY-MM-DD
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
    const [month, day, year] = dateStr.split('/');
    // Direct string manipulation to avoid timezone issues
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // If it's an ISO string with time, extract just the date part
  if (dateStr.includes('T')) {
    return dateStr.split('T')[0];
  }
  
  // Default fallback - try to parse and format
  try {
    const date = parseDate(dateStr);
    // Use UTC methods to avoid timezone shifts
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error parsing date:', error);
    return dateStr; // Return as is if parsing fails
  }
};

/**
 * Add days to a date
 * @param {string} dateStr - Date string in various formats
 * @param {number} days - Number of days to add
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const addDaysToDate = (dateStr, days) => {
  const date = parseDate(dateStr);
  const newDate = new Date(date);
  newDate.setUTCDate(newDate.getUTCDate() + days);
  
  const year = newDate.getUTCFullYear();
  const month = String(newDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(newDate.getUTCDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};
