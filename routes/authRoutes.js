// Import express
const express = require('express');

// Import controllers
const { authControllers } = require('../controllers');

// Initializing express router
const router = express.Router();

// POST: Send verification email
router
  .route('/send-verification-email')
  .post(authControllers.sendVerificationEmail);

// POST: Verify account
router.route('/verify-email').post(authControllers.verifyEmail);

// POST: login
router.route('/login').post(authControllers.login);

// Export router
module.exports = router;
