/**
 * User Controller
 * 
 * This controller handles user-specific operations like managing user settings
 * and file uploads.
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
import { getSettings, createOrUpdateSettings } from '../models/settingsModel.js';

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
 * Get user settings
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserSettingsHandler = async (req, res) => {
  try {
    // Get user settings
    const settings = await getSettings(req.user.id);
    
    if (!settings) {
      // Return default settings if no user settings found
      return res.json({
        logoPath: null,
        footerText: null
      });
    }
    
    // Return user settings
    res.json({
      logoPath: settings.logoPath || null,
      footerText: settings.footerText || null
    });
  } catch (error) {
    console.error('Error getting user settings:', error);
    // Return empty settings instead of error
    res.json({
      logoPath: null,
      footerText: null
    });
  }
};

/**
 * Update user settings
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateUserSettings = async (req, res) => {
  try {
    const { logoPath, footerText } = req.body;
    
    // Save settings to database
    const updatedSettings = await createOrUpdateSettings({
      userId: req.user.id,
      logoPath,
      footerText
    });
    
    res.json(updatedSettings);
  } catch (error) {
    console.error('Error updating user settings:', error);
    // Return the original settings with an error flag
    res.json({
      logoPath: req.body.logoPath,
      footerText: req.body.footerText,
      error: 'Failed to save settings'
    });
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
        console.error('Multer error:', err);
        return res.json({ error: err.message });
      }
      
      // If no file was uploaded
      if (!req.file) {
        console.error('No file uploaded');
        return res.json({ error: 'No file uploaded' });
      }
      
      try {
        // Get current settings
        const settings = await getSettings(req.user.id);
        
        // If there's an existing logo, delete it
        if (settings && settings.logoPath) {
          const oldLogoPath = path.join(__dirname, '..', settings.logoPath);
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
      } catch (innerError) {
        console.error('Error in logo upload processing:', innerError);
        res.json({ 
          error: 'Failed to process logo upload',
          logoPath: null
        });
      }
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.json({ 
      error: 'Failed to upload logo',
      logoPath: null
    });
  }
};

export {
  getUserSettingsHandler,
  updateUserSettings,
  uploadLogo
};
