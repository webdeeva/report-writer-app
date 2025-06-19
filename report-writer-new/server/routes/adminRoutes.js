import express from 'express';
import { protect as authenticateToken, admin as isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Import user model
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser,
  getUserUsage
} from '../models/userModel.js';

// Import admin controller
import {
  getAppSettings,
  updateAppSettings,
  uploadLogo,
  getUsersForDropdown,
  resetUserPassword
} from '../controllers/adminController.js';

// Get all users (admin only)
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID (admin only)
router.get('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const user = await getUserById(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new user (admin only)
router.post('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { username, password, isAdmin, reportLimit } = req.body;
    const newUser = await createUser({ 
      username, 
      password, 
      isAdmin: isAdmin || false,
      reportLimit: reportLimit || null
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user (admin only)
router.patch('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const updates = req.body;
    const updatedUser = await updateUser(userId, updates);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user (admin only)
router.delete('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const deleted = await deleteUser(userId);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user usage statistics (admin only)
router.get('/users/:id/usage', authenticateToken, isAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const usage = await getUserUsage(userId);
    res.json(usage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get application settings (admin only)
router.get('/settings', authenticateToken, isAdmin, getAppSettings);

// Update application settings (admin only)
router.post('/settings', authenticateToken, isAdmin, updateAppSettings);

// Upload logo (admin only)
router.post('/upload-logo', authenticateToken, isAdmin, uploadLogo);

// Get users for dropdown (admin only)
router.get('/users-dropdown', authenticateToken, isAdmin, getUsersForDropdown);

// Reset user password (admin only)
router.post('/users/reset-password', authenticateToken, isAdmin, resetUserPassword);

export default router;
