import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory name (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const dbPath = process.env.DB_PATH || path.join(__dirname, '../data/db.json');

// Default data structure
const defaultData = { users: [], people: [], reports: [], settings: [] };

// Initialize lowdb
const adapter = new JSONFile(dbPath);
const db = new Low(adapter, defaultData); // Pass defaultData as the second argument

// Read data from JSON file
const loadDb = async () => {
  await db.read();
  db.data ||= { users: [], people: [], reports: [], settings: [] };
};

// Write data to JSON file
const saveDb = async () => {
  await db.write();
};

/**
 * Get settings for a user
 * @param {string} userId User ID
 * @returns {Object|null} Settings object or null if not found
 */
const getSettings = async (userId) => {
  await loadDb();
  return db.data.settings.find(setting => setting.userId === userId) || null;
};

/**
 * Get all settings (admin only)
 * @returns {Array} Array of settings
 */
const getAllSettings = async () => {
  await loadDb();
  return db.data.settings;
};

/**
 * Create or update settings for a user
 * @param {Object} settingsData Settings data
 * @returns {Object} Created or updated settings
 */
const createOrUpdateSettings = async (settingsData) => {
  await loadDb();
  
  const settingIndex = db.data.settings.findIndex(setting => 
    setting.userId === settingsData.userId
  );
  
  if (settingIndex === -1) {
    // Create new settings
    const newSettings = {
      id: db.data.settings.length > 0 
        ? Math.max(...db.data.settings.map(setting => setting.id)) + 1 
        : 1,
      userId: settingsData.userId,
      reportLimit: settingsData.reportLimit,
      logoPath: settingsData.logoPath || null,
      footerText: settingsData.footerText || null,
      assignedUserId: settingsData.assignedUserId || null,
      updatedAt: new Date().toISOString()
    };
    
    db.data.settings.push(newSettings);
    await saveDb();
    
    return newSettings;
  } else {
    // Update existing settings
    const updatedSettings = {
      ...db.data.settings[settingIndex],
      ...settingsData,
      updatedAt: new Date().toISOString()
    };
    
    db.data.settings[settingIndex] = updatedSettings;
    await saveDb();
    
    return updatedSettings;
  }
};

/**
 * Delete settings for a user
 * @param {string} userId User ID
 * @returns {boolean} True if deleted, false if not found
 */
const deleteSettings = async (userId) => {
  await loadDb();
  
  const settingIndex = db.data.settings.findIndex(setting => 
    setting.userId === userId
  );
  
  if (settingIndex === -1) return false;
  
  // Remove from database
  db.data.settings.splice(settingIndex, 1);
  await saveDb();
  
  return true;
};

export {
  getSettings,
  getAllSettings,
  createOrUpdateSettings,
  deleteSettings
};
