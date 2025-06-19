import asyncHandler from 'express-async-handler';
import { 
  authenticateUser, 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../models/index.js';

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('Please provide username and password');
  }

  const user = await authenticateUser(username, password);

  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  res.json(user);
});

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user);
});

/**
 * @desc    Get all users
 * @route   GET /api/auth/users
 * @access  Private/Admin
 */
const getUsersList = asyncHandler(async (req, res) => {
  const users = await getUsers();
  res.json(users);
});

/**
 * @desc    Create a new user
 * @route   POST /api/auth/users
 * @access  Private/Admin
 */
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, isAdmin } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('Please provide username and password');
  }

  try {
    const user = await createUser({
      username,
      password,
      isAdmin: isAdmin || false
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400);
    throw error;
  }
});

/**
 * @desc    Update a user
 * @route   PUT /api/auth/users/:id
 * @access  Private/Admin
 */
const updateExistingUser = asyncHandler(async (req, res) => {
  const { username, password, isAdmin } = req.body;
  const userId = parseInt(req.params.id);

  const updatedUser = await updateUser(userId, {
    username,
    password,
    isAdmin
  });

  if (!updatedUser) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(updatedUser);
});

/**
 * @desc    Delete a user
 * @route   DELETE /api/auth/users/:id
 * @access  Private/Admin
 */
const deleteExistingUser = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);

  const deleted = await deleteUser(userId);

  if (!deleted) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({ message: 'User deleted successfully' });
});

export {
  login,
  getProfile,
  getUsersList,
  createNewUser,
  updateExistingUser,
  deleteExistingUser
};
