// Creating a controllers object
const controllers = {};

// Importing controllers
const usersControllers = require('./usersControllers');
const authControllers = require('./authControllers');
const urlChecksControllers = require('./urlChecksControllers');
const reportsControllers = require('./reportsControllers');

// Adding controllers as attributes to controllers object
controllers.usersControllers = usersControllers;
controllers.authControllers = authControllers;
controllers.urlChecksControllers = urlChecksControllers;
controllers.reportsControllers = reportsControllers;

// Export controllers object
module.exports = controllers;
