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
// GET: Find user by id
router
  .route('/:id')
  .get(
    authControllers.authenticateUser,
    authControllers.authorizeUser('admin'),
    usersControllers.findOne,
    usersControllers.returnUser
  );

// POST: Create a user
router
  .route('/')
  .post(usersControllers.create, authControllers.sendVerificationEmail);

// GET: Find user by id
router
  .route('/:id')
  .delete(
    authControllers.authenticateUser,
    authControllers.authorizeUser('admin'),
    usersControllers.findOne,
    usersControllers.deleteOne
  );

// Export users router
module.exports = router;
