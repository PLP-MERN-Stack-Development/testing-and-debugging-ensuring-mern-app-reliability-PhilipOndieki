/**
 * Auth Routes
 * Routes for user authentication
 */

const express = require('express');
const {
  signup,
  login,
  logout,
  getMe,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes (require authentication)
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
