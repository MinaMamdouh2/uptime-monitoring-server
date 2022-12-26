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

//GET: Get reports
router
  .route('/')
  .get(
    authControllers.authenticateUser,
    authControllers.authorizeUser('user'),
    urlChecksControllers.find,
    reportsControllers.find
  );

// GET: Get a report for a specific URL check
router
  .route('/:id')
  .get(
    authControllers.authenticateUser,
    authControllers.authorizeUser('user'),
    urlChecksControllers.findOne,
    reportsControllers.findOne
  );

// Export router
module.exports = router;
