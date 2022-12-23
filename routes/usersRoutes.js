// Import express
const express = require('express');

// Import controllers
const { usersControllers, authControllers } = require('../controllers');

// Initializing express router
const router = express.Router();

// GET: Find all users
router
  .route('/')
  .get(
    authControllers.authenticateUser,
    authControllers.authorizeUser('admin'),
    usersControllers.findAll
  );

// POST: Create a user
router
  .route('/')
  .post(usersControllers.create, authControllers.sendVerificationEmail);

// Export users router
module.exports = router;
