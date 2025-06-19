/**
 * Admin Controller
 * 
 * This controller handles admin-specific operations like managing settings,
 * user management, and file uploads.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

// Get the directory name (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models
import { getAllSettings, createOrUpdateSettings } from '../models/settingsModel.js';
import { getUsers, getUserById, updateUser } from '../models/userModel.js';

// Promisify fs functions
const unlinkAsync = promisify(fs.unlink);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/logos');
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with original extension
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    cb(null, fileName);
  }
});

// Create multer upload instance
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  }
});

/**
 * Get all application settings
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAppSettings = async (req, res) => {
  try {
    // Get all settings
    const settings = await getAllSettings();
    
    // Get the admin settings (first user or create default)
    let adminSettings = settings.find(s => s.userId === req.user.id);
    
    if (!adminSettings) {
      // Return default settings if no admin settings found
      return res.json({
        apiKey: process.env.OPENAI_API_KEY || '',
        costPerToken: 0.00002,
        defaultReportLimit: null,
        maxTokensPerRequest: 4000,
        systemPrompt: '',
        logoPath: null,
        footerText: null,
        assignedUserId: null
      });
    }
    
    // Return admin settings
    res.json({
      apiKey: process.env.OPENAI_API_KEY || adminSettings.apiKey || '',
      costPerToken: adminSettings.costPerToken || 0.00002,
      defaultReportLimit: adminSettings.defaultReportLimit || null,
      maxTokensPerRequest: adminSettings.maxTokensPerRequest || 4000,
      systemPrompt: adminSettings.systemPrompt || '',
      logoPath: adminSettings.logoPath || null,
      footerText: adminSettings.footerText || null,
      assignedUserId: adminSettings.assignedUserId || null
    });
  } catch (error) {
    console.error('Error getting app settings:', error);
    res.status(500).json({ message: 'Failed to get application settings' });
  }
};

/**
 * Update application settings
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateAppSettings = async (req, res) => {
  try {
    const { 
      apiKey, 
      costPerToken, 
      defaultReportLimit, 
      maxTokensPerRequest, 
      systemPrompt,
      footerText,
      assignedUserId
    } = req.body;
    
    // Update environment variable if provided
    if (apiKey) {
      process.env.OPENAI_API_KEY = apiKey;
    }
    
    // Save settings to database
    const updatedSettings = await createOrUpdateSettings({
      userId: req.user.id,
      apiKey,
      costPerToken: parseFloat(costPerToken) || 0.00002,
      defaultReportLimit: defaultReportLimit === '' ? null : parseInt(defaultReportLimit),
      maxTokensPerRequest: parseInt(maxTokensPerRequest) || 4000,
      systemPrompt,
      footerText,
      assignedUserId: assignedUserId === '' ? null : parseInt(assignedUserId)
    });
    
    res.json(updatedSettings);
  } catch (error) {
    console.error('Error updating app settings:', error);
    res.status(500).json({ message: 'Failed to update application settings' });
  }
};

/**
 * Upload logo file
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadLogo = async (req, res) => {
  try {
    // Use multer to handle the file upload
    upload.single('logo')(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      
      // If no file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      // Get current settings
      const settings = await getAllSettings();
      const adminSettings = settings.find(s => s.userId === req.user.id);
      
      // If there's an existing logo, delete it
      if (adminSettings && adminSettings.logoPath) {
        const oldLogoPath = path.join(__dirname, '..', adminSettings.logoPath);
        try {
          await unlinkAsync(oldLogoPath);
        } catch (error) {
          console.error('Error deleting old logo:', error);
          // Continue even if delete fails
        }
      }
      
      // Update settings with new logo path
      const logoPath = `/uploads/logos/${req.file.filename}`;
      await createOrUpdateSettings({
        userId: req.user.id,
        logoPath
      });
      
      res.json({ logoPath });
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ message: 'Failed to upload logo' });
  }
};

/**
 * Get all users for dropdown
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUsersForDropdown = async (req, res) => {
  try {
    const users = await getUsers();
    // Return only necessary fields
    const userOptions = users.map(user => ({
      id: user.id,
      username: user.username
    }));
    res.json(userOptions);
  } catch (error) {
    console.error('Error getting users for dropdown:', error);
    res.status(500).json({ message: 'Failed to get users' });
  }
};

/**
 * Reset user password
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const resetUserPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    
    // Validate input
    if (!userId || !newPassword) {
      return res.status(400).json({ message: 'User ID and new password are required' });
    }
    
    // Check if user exists
    const user = await getUserById(parseInt(userId));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user password
    const updatedUser = await updateUser(parseInt(userId), {
      password: newPassword
    });
    
    if (!updatedUser) {
      return res.status(500).json({ message: 'Failed to reset password' });
    }
    
    res.json({ 
      message: `Password successfully reset for user: ${updatedUser.username}`,
      userId: updatedUser.id,
      username: updatedUser.username
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
};

export {
  getAppSettings,
  updateAppSettings,
  uploadLogo,
  getUsersForDropdown,
  resetUserPassword
};
