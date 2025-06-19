/**
 * Script to fix birthdates in the database
 * 
 * This script will:
 * 1. Load all people from the database
 * 2. Fix any birthdates that might have timezone issues
 * 3. Save the updated people back to the database
 */

import { getPeople, updatePerson } from '../models/index.js';
import { parseDate, format } from 'date-fns';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Get the directory name (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the backup file
const BACKUP_PATH = path.join(__dirname, '../data/people-backup.json');

/**
 * Parse a date string safely without timezone issues
 * @param {string} dateStr - Date string in various formats
 * @returns {Date} Date object
 */
const parseDateSafely = (dateStr) => {
  // For YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return parseDate(dateStr);
  }
  
  // For MM/DD/YYYY format
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
    const [month, day, year] = dateStr.split('/');
    const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    return parseDate(isoDate);
  }
  
  // For ISO format with time
  if (dateStr.includes('T')) {
    return parseDate(dateStr);
  }
  
  // Default fallback - try to parse as is
  try {
    return new Date(dateStr);
  } catch (error) {
    console.error('Error parsing date:', error);
    return new Date(); // Return current date as fallback
  }
};

/**
 * Convert date to YYYY-MM-DD format
 * @param {Date} date - Date object
 * @returns {string} Date string in YYYY-MM-DD format
 */
const toISODateString = (date) => {
