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

// GET: Get a specific URL CHECK
router
  .route('/:id')
  .get(
    authControllers.authenticateUser,
    authControllers.authorizeUser('user'),
    urlChecksControllers.findOne
  );

// PUT: Update a check
router
  .route('/:id')
  .put(
    authControllers.authenticateUser,
    authorizeUser('user'),
    urlChecksControllers.updateOne
  );
// DELETE: delete a specific URL check
router
  .route('/:id')
  .delete(
    authControllers.authenticateUser,
    authorizeUser('user'),
    urlChecksControllers.deleteOne
  );

// Export router
module.exports = router;
