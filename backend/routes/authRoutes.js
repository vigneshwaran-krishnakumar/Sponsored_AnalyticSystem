const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Signup route
router.post('/signup', authController.signup);

// Login route
router.post('/login', authController.login);

// ✅ NEW: Validate token & return current user
router.get('/me', authController.me);

module.exports = router;