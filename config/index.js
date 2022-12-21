// Creating a configuration object
const configurations = {};

// Import db configuration
const dbConfig = require('./dbConfig');

// Adding dbConfig property to configurations object
configurations.dbConfig = dbConfig;

// Exporting configurations object
module.exports = configurations;
