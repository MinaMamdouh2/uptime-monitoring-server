// Import express
const express = require('express');

// Import controllers
const { usersControllers } = require('../controllers');

// Initializing express router
const router = express.Router();

// GET: Find all users
router.route('/').get(usersControllers.findAll);

// POST: Create a user
router.route('/').post(usersControllers.create);

// Export users router
module.exports = router;
