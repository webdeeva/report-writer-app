import express from 'express';
import { protect as authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Import user controller
import {
  getUserSettingsHandler,
  updateUserSettings,
  uploadLogo
} from '../controllers/userController.js';

// Get user settings
router.get('/settings', authenticateToken, getUserSettingsHandler);

// Update user settings
router.post('/settings', authenticateToken, updateUserSettings);

// Upload logo
router.post('/upload-logo', authenticateToken, uploadLogo);

export default router;
