// Creating a configuration object
const configurations = {};

// Import db configuration
const dbConfig = require('./dbConfig');

// Import bcrypt configuration
const bcryptConfig = require('./bcryptConfig');

// Import nodemailer configuration
const nodemailerConfig = require('./nodemailerConfig');

// Import jwt configuration
const jwtConfig = require('./jwtConfig');

// Adding controllers as attributes to controllers object
configurations.dbConfig = dbConfig;

// Adding dbConfig property to configurations object
configurations.bcryptConfig = bcryptConfig;

// Adding nodemailerConfig proprty to configurations object
configurations.nodemailerConfig = nodemailerConfig;

// Adding jwtConfig proprty to configurations object
configurations.jwtConfig = jwtConfig;

// Exporting configurations object
module.exports = configurations;
