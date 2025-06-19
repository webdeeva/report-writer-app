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
 * Get all reports for a user
 * @param {string} userId User ID
 * @returns {Array} Array of reports with person names
 */
const getReports = async (userId) => {
  await loadDb();
  
  // Get all reports for the user
  const reports = db.data.reports.filter(report => report.userId === userId);
  
  // Add person names to the reports
  return reports.map(report => {
    // Find person1 and person2 (if applicable)
    const person1 = db.data.people.find(p => p.id === report.person1Id);
    const person2 = report.person2Id ? db.data.people.find(p => p.id === report.person2Id) : null;
    
    return {
      ...report,
      person1Name: person1 ? person1.name : 'Unknown',
      person2Name: person2 ? person2.name : null
    };
  });
};

/**
 * Get report by ID
 * @param {number} id Report ID
 * @returns {Object|null} Report object or null if not found
 */
const getReportById = async (id) => {
  await loadDb();
  return db.data.reports.find(report => report.id === id) || null;
};

/**
 * Create a new report
 * @param {Object} reportData Report data
 * @returns {Object} Created report
 */
const createReport = async (reportData) => {
  await loadDb();
  
  // Generate ID
  const id = db.data.reports.length > 0 
    ? Math.max(...db.data.reports.map(report => report.id)) + 1 
    : 1;
  
  // Create report
  const newReport = {
    id,
    type: reportData.type,
    person1Id: reportData.person1Id,
    person2Id: reportData.person2Id,
    customAge: reportData.customAge || null,
    content: reportData.content,
    pdfUrl: reportData.pdfUrl || null,
    tokensUsed: reportData.tokensUsed || 0,
    cost: reportData.cost || 0,
    userId: reportData.userId,
    createdAt: new Date().toISOString()
  };
  
  // Add to database
  db.data.reports.push(newReport);
  await saveDb();
  
  return newReport;
};

/**
 * Update a report
 * @param {number} id Report ID
 * @param {Object} reportData Report data to update
 * @param {string} userId User ID (for authorization)
 * @returns {Object|null} Updated report or null if not found or not authorized
 */
const updateReport = async (id, reportData, userId) => {
  await loadDb();
  
  const reportIndex = db.data.reports.findIndex(report => 
    report.id === id && report.userId === userId
  );
  
  if (reportIndex === -1) return null;
  
  // Update report
  const updatedReport = {
    ...db.data.reports[reportIndex],
    ...reportData,
    userId // Ensure userId doesn't change
  };
  
  // Update in database
  db.data.reports[reportIndex] = updatedReport;
  await saveDb();
  
  return updatedReport;
};

/**
 * Delete a report
 * @param {number} id Report ID
 * @param {string} userId User ID (for authorization)
 * @returns {boolean} True if deleted, false if not found or not authorized
 */
const deleteReport = async (id, userId) => {
  await loadDb();
  
  const reportIndex = db.data.reports.findIndex(report => 
    report.id === id && report.userId === userId
  );
  
  if (reportIndex === -1) return false;
  
  // Remove from database
  db.data.reports.splice(reportIndex, 1);
  await saveDb();
  
  return true;
};

/**
 * Get report usage statistics for a user
 * @param {string} userId User ID
 * @returns {Object} Usage statistics
 */
const getReportUsage = async (userId) => {
  await loadDb();
  
  const userReports = db.data.reports.filter(report => report.userId === userId);
  
  // Get settings for the user
  const userSettings = db.data.settings.find(setting => setting.userId === userId);
  const reportLimit = userSettings?.reportLimit || null;
  
  // Calculate usage
  const totalReports = userReports.length;
  const totalTokens = userReports.reduce((sum, report) => sum + (report.tokensUsed || 0), 0);
  const totalCost = userReports.reduce((sum, report) => sum + (report.cost || 0), 0);
  
  // Calculate remaining reports
  const remainingReports = reportLimit !== null ? Math.max(0, reportLimit - totalReports) : null;
  
  return {
    totalReports,
    totalTokens,
    totalCost,
    reportLimit,
    remainingReports,
    canGenerate: reportLimit === null || totalReports < reportLimit
  };
};

export {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  getReportUsage
};
