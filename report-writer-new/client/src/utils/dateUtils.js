/**
 * Utility functions for date operations using date-fns
 */
import { format } from 'date-fns';
/**
 * Parse a date string safely without timezone issues
 * @param dateStr Date string in various formats
 * @returns Date object or null if invalid
 */
export const parseDate = (dateStr) => {
    try {
        // For YYYY-MM-DD format
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            const [year, month, day] = dateStr.split('-').map(Number);
            // Create date using UTC to avoid timezone issues
            const date = new Date(Date.UTC(year, month - 1, day));
            return date;
        }
        // For MM/DD/YYYY format
        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
            const [month, day, year] = dateStr.split('/').map(Number);
            // Create date using UTC to avoid timezone issues
            const date = new Date(Date.UTC(year, month - 1, day));
            return date;
        }
        // For ISO format with time
        if (dateStr.includes('T')) {
            const datePart = dateStr.split('T')[0];
            const [year, month, day] = datePart.split('-').map(Number);
            // Create date using UTC to avoid timezone issues
            const date = new Date(Date.UTC(year, month - 1, day));
            return date;
        }
        // Default fallback - try to parse as is
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? null : date;
    }
    catch (error) {
        console.error('Error parsing date:', error);
        return null;
    }
};
/**
 * Calculate age based on birthdate
 * @param birthdate Birthdate string in ISO format (YYYY-MM-DD)
 * @returns Age in years
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
        }
        else {
            // If it's already a date string like YYYY-MM-DD
            const [year, month, day] = birthdate.split('-').map(Number);
            birthDate = new Date(Date.UTC(year, month - 1, day)); // Use UTC to avoid timezone issues
        }
    }
    else {
        return 0; // Invalid input
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
 * @param dateStr Date string in various formats
 * @param formatType Format type ('short', 'medium', 'long')
 * @returns Formatted date string
 */
export const formatDate = (dateStr, formatType = 'medium') => {
    const date = parseDate(dateStr);
    if (!date)
        return '';
    const formatPatterns = {
        short: 'MM/dd/yyyy',
        medium: 'MMM d, yyyy',
        long: 'MMMM d, yyyy'
    };
    return format(date, formatPatterns[formatType]);
};
/**
 * Get month and day from a date
 * @param dateStr Date string in various formats
 * @returns Month/day string (e.g., "12/25")
 */
export const getMonthDay = (dateStr) => {
    const date = parseDate(dateStr);
    if (!date)
        return '';
    // Use UTC methods to avoid timezone shifts
    const month = date.getUTCMonth() + 1; // getMonth() returns 0-11
    const day = date.getUTCDate();
    return `${month}/${day}`;
};
/**
 * Convert MM/DD/YYYY to YYYY-MM-DD format
 * @param dateStr Date string in MM/DD/YYYY format
 * @returns Date string in YYYY-MM-DD format
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
    // For other formats, use a timezone-neutral approach
    try {
        // Parse the date string
        const date = parseDate(dateStr);
        if (!date)
            return dateStr;
        // Use UTC methods to avoid timezone shifts
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    catch (error) {
        console.error('Error converting date:', error);
        return dateStr;
    }
};
/**
 * Add days to a date
 * @param dateStr Date string in various formats
 * @param days Number of days to add
 * @returns Date string in YYYY-MM-DD format
 */
export const addDaysToDate = (dateStr, days) => {
    const date = parseDate(dateStr);
    if (!date)
        return dateStr;
    const newDate = new Date(date);
    newDate.setUTCDate(newDate.getUTCDate() + days);
    const year = newDate.getUTCFullYear();
    const month = String(newDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(newDate.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
/**
 * Convert YYYY-MM-DD to MM/DD/YYYY format
 * @param dateStr Date string in YYYY-MM-DD format
 * @returns Date string in MM/DD/YYYY format
 */
export const toDisplayDateString = (dateStr) => {
    // If already in MM/DD/YYYY format, return as is
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
        return dateStr;
    }
    // For YYYY-MM-DD format - direct string manipulation to avoid timezone issues
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split('-');
        return `${month}/${day}/${year}`;
    }
    // For ISO format with time - direct string manipulation to avoid timezone issues
    if (dateStr.includes('T')) {
        const datePart = dateStr.split('T')[0];
        const [year, month, day] = datePart.split('-');
        return `${month}/${day}/${year}`;
    }
    // For other formats, use a timezone-neutral approach
    try {
        const date = parseDate(dateStr);
        if (!date)
            return '';
        // Use UTC methods to avoid timezone shifts
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${month}/${day}/${year}`;
    }
    catch (error) {
        console.error('Error converting date:', error);
        return '';
    }
};
