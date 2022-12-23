// Creating a controllers object
const controllers = {};

// Importing controllers
const usersControllers = require('./usersControllers');
const authControllers = require('./authControllers');

// Adding controllers as attributes to controllers object
controllers.usersControllers = usersControllers;
controllers.authControllers = authControllers;

// Export controllers object
module.exports = controllers;
