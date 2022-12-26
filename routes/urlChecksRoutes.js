// Import express
const express = require('express');

// Import controllers
const { authControllers, urlChecksControllers } = require('../controllers');
const { authorizeUser } = require('../controllers/authControllers');

// Initializing express router
const router = express.Router();

// POST: Create a URL check
router
  .route('/')
  .post(
    authControllers.authenticateUser,
    authControllers.authorizeUser('user'),
    urlChecksControllers.create
  );

// GET: Get URL Checks
router
  .route('/')
  .get(
    authControllers.authenticateUser,
    authControllers.authorizeUser('user'),
    urlChecksControllers.find
  );

// GET: Get a specific URL CHECK
router
  .route('/:id')
  .get(
    authControllers.authenticateUser,
    authControllers.authorizeUser('user'),
    urlChecksControllers.findOne,
    urlChecksControllers.returnUrlCheck
  );

// PUT: Update a check
router
  .route('/:id')
  .put(
    authControllers.authenticateUser,
    authorizeUser('user'),
    urlChecksControllers.findOne,
    urlChecksControllers.updateOne
  );

// DELETE: delete a specific URL check
router
  .route('/:id')
  .delete(
    authControllers.authenticateUser,
    authorizeUser('user'),
    urlChecksControllers.findOne,
    urlChecksControllers.deleteOne
  );

// Export router
module.exports = router;
