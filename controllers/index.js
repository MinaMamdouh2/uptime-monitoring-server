// Creating a controllers object
const controllers = {};

// Importing controllers
const usersControllers = require('./usersControllers');

// Adding controllers as attributes to controllers object
controllers.usersControllers = usersControllers;

// Export controllers object
module.exports = controllers;
