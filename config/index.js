// Creating a configuration object
const configurations = {};

// Import db configuration
const dbConfig = require('./dbConfig');

//Import bcrypt configuration
const bcryptConfig = require('./bcryptConfig');

// Adding dbConfig property to configurations object
configurations.dbConfig = dbConfig;

// Adding dbConfig property to configurations object
configurations.bcryptConfig = bcryptConfig;

// Exporting configurations object
module.exports = configurations;
