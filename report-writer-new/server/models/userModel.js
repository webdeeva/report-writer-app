import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Get the directory name (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const dbPath = process.env.DB_PATH || path.join(__dirname, '../data/db.json');
const dbDir = path.dirname(dbPath);

// Create data directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Default data structure
const defaultData = {
  users: [
    {
      id: 1,
      username: 'admin',
      password: bcrypt.hashSync('admin123', 10),
      isAdmin: true,
      createdAt: new Date().toISOString()
    }
  ],
  people: [],
  reports: [],
  settings: []
};

// Initialize database with default data if it doesn't exist
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
  console.log('Created default database with admin user');
}

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

// User functions

/**
 * Get all users
 * @returns {Array} Array of users (without passwords)
 */
const getUsers = async () => {
  await loadDb();
  return db.data.users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};

/**
 * Get user by ID
 * @param {number} id User ID
 * @returns {Object|null} User object (without password) or null if not found
 */
const getUserById = async (id) => {
  await loadDb();
  const user = db.data.users.find(user => user.id === id);
  
  if (!user) return null;
  
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Get user by username
 * @param {string} username Username
 * @returns {Object|null} User object or null if not found
 */
const getUserByUsername = async (username) => {
  await loadDb();
  return db.data.users.find(user => user.username === username) || null;
};

/**
 * Create a new user
 * @param {Object} userData User data
 * @returns {Object} Created user (without password)
 */
const createUser = async (userData) => {
  await loadDb();
  
  // Check if username already exists
  const existingUser = await getUserByUsername(userData.username);
  if (existingUser) {
    throw new Error('Username already exists');
  }
  
  // Generate ID
  const id = db.data.users.length > 0 
    ? Math.max(...db.data.users.map(user => user.id)) + 1 
    : 1;
  
  // Hash password
  const hashedPassword = bcrypt.hashSync(userData.password, 10);
  
  // Create user
  const newUser = {
    id,
    username: userData.username,
    password: hashedPassword,
    isAdmin: userData.isAdmin || false,
    isPremium: userData.isPremium || false,
    createdAt: new Date().toISOString()
  };
  
  // Add to database
  db.data.users.push(newUser);
  await saveDb();
  
  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

/**
 * Update a user
 * @param {number} id User ID
 * @param {Object} userData User data to update
 * @returns {Object|null} Updated user (without password) or null if not found
 */
const updateUser = async (id, userData) => {
  await loadDb();
  
  const userIndex = db.data.users.findIndex(user => user.id === id);
  
  if (userIndex === -1) return null;
  
  // Update user
  const updatedUser = {
    ...db.data.users[userIndex],
    ...userData
  };
  
  // Hash password if provided
  if (userData.password) {
    updatedUser.password = bcrypt.hashSync(userData.password, 10);
  }
  
  // Update in database
  db.data.users[userIndex] = updatedUser;
  await saveDb();
  
  // Return user without password
  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

/**
 * Delete a user
 * @param {number} id User ID
 * @returns {boolean} True if deleted, false if not found
 */
const deleteUser = async (id) => {
  await loadDb();
  
  const userIndex = db.data.users.findIndex(user => user.id === id);
  
  if (userIndex === -1) return false;
  
  // Remove from database
  db.data.users.splice(userIndex, 1);
  await saveDb();
  
  return true;
};

/**
 * Authenticate a user
 * @param {string} username Username
 * @param {string} password Password
 * @returns {Object|null} User object with token or null if authentication fails
 */
const authenticateUser = async (username, password) => {
  const user = await getUserByUsername(username);
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return null;
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, username: user.username, isAdmin: user.isAdmin, isPremium: user.isPremium || false },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
  
  // Return user with token (without password)
  const { password: _, ...userWithoutPassword } = user;
  return {
    ...userWithoutPassword,
    token
  };
};

/**
 * Get usage statistics for a user
 * @param {number} userId User ID
 * @returns {Object} Usage statistics
 */
const getUserUsage = async (userId) => {
  await loadDb();
  
  // Get all reports for the user
  const userReports = db.data.reports.filter(report => report.userId === userId);
  
  // Calculate totals
  const totalReports = userReports.length;
  const totalTokens = userReports.reduce((sum, report) => sum + (report.tokensUsed || 0), 0);
  const totalCost = userReports.reduce((sum, report) => sum + (report.cost || 0), 0);
  
  return {
    totalReports,
    totalTokens,
    totalCost
  };
};

export {
  getUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  authenticateUser,
  getUserUsage
};
