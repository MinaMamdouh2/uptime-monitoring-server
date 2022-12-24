// Creating a controllers object
const controllers = {};

// Importing controllers
const usersControllers = require('./usersControllers');
const authControllers = require('./authControllers');
const urlChecksControllers = require('./urlChecksControllers');

// Adding controllers as attributes to controllers object
controllers.usersControllers = usersControllers;
controllers.authControllers = authControllers;
controllers.urlChecksControllers = urlChecksControllers;

// Export controllers object
module.exports = controllers;
