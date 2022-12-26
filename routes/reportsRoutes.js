// Import express
const express = require('express');

// Import controllers
const {
  authControllers,
  urlChecksControllers,
  reportsControllers,
} = require('../controllers');

// Initializing express router
const router = express.Router();

// GET: Get a report for a specific URL check
router
  .route('/:id')
  .get(
    authControllers.authenticateUser,
    authControllers.authorizeUser('user'),
    urlChecksControllers.findOne,
    reportsControllers.getReport
  );

// Export router
module.exports = router;
