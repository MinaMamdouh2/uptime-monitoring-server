// Import express
const express = require('express');

// Import controllers
const { authControllers, urlChecksControllers } = require('../controllers');

// Initializing express router
const router = express.Router();

// POST: Create check
router
  .route('/')
  .post(
    authControllers.authenticateUser,
    authControllers.authorizeUser('user'),
    urlChecksControllers.create
  );

// Export router
module.exports = router;
