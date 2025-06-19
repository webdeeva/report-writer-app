import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory name (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const dbPath = process.env.DB_PATH || path.join(__dirname, '../data/database.json');

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
 * Get all people for a user
 * @param {string} userId User ID
 * @returns {Array} Array of people
 */
const getPeople = async (userId) => {
  await loadDb();
  return db.data.people.filter(person => person.userId === userId);
};

/**
 * Get person by ID
 * @param {number} id Person ID
 * @returns {Object|null} Person object or null if not found
 */
const getPersonById = async (id) => {
  await loadDb();
  return db.data.people.find(person => person.id === id) || null;
};

/**
 * Create a new person
 * @param {Object} personData Person data
 * @returns {Object} Created person
 */
const createPerson = async (personData) => {
  await loadDb();
  
  // Generate ID
  const id = db.data.people.length > 0 
    ? Math.max(...db.data.people.map(person => person.id)) + 1 
    : 1;
  
  // Create person
  const newPerson = {
    id,
    name: personData.name,
    birthdate: personData.birthdate,
    userId: personData.userId,
    createdAt: new Date().toISOString()
  };
  
  // Add to database
  db.data.people.push(newPerson);
  await saveDb(); // Save to database
  
  return newPerson;
};

/**
 * Update a person
 * @param {number} id Person ID
 * @param {Object} personData Person data to update
 * @param {string} userId User ID (for authorization)
 * @returns {Object|null} Updated person or null if not found or not authorized
 */
const updatePerson = async (id, personData, userId) => {
  await loadDb();
  
  const personIndex = db.data.people.findIndex(person => 
    person.id === id && person.userId === userId
  );
  
  if (personIndex === -1) return null;
  
  // Update person
  const updatedPerson = {
    ...db.data.people[personIndex],
    ...personData,
    userId // Ensure userId doesn't change
  };
  
  // Update in database
  db.data.people[personIndex] = updatedPerson;
  await saveDb();
  
  return updatedPerson;
};

/**
 * Delete a person
 * @param {number} id Person ID
 * @param {string} userId User ID (for authorization)
 * @returns {boolean} True if deleted, false if not found or not authorized
 */
const deletePerson = async (id, userId) => {
  await loadDb();
  
  // Check if person is used in any reports
  const isUsedInReports = db.data.reports.some(report => 
    report.person1Id === id || report.person2Id === id
  );
  
  if (isUsedInReports) {
    throw new Error('Cannot delete person because they are used in reports');
  }
  
  const personIndex = db.data.people.findIndex(person => 
    person.id === id && person.userId === userId
  );
  
  if (personIndex === -1) return false;
  
  // Remove from database
  db.data.people.splice(personIndex, 1);
  await saveDb();
  
  return true;
};

export {
  getPeople,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson
};
