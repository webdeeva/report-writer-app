import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { 
  login, 
  getProfile, 
  getUsersList, 
  createNewUser, 
  updateExistingUser, 
  deleteExistingUser 
} from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes (require authentication)
router.get('/profile', protect, getProfile);

// Admin routes (require admin privileges)
router.get('/users', protect, admin, getUsersList);
router.post('/users', protect, admin, createNewUser);
router.put('/users/:id', protect, admin, updateExistingUser);
router.delete('/users/:id', protect, admin, deleteExistingUser);

export default router;
