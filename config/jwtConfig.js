// Import enviroment variables
require('dotenv').config();

// Creating a jwt configuration object
const jwtConfig = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_SECRET_LINKS: process.env.JWT_SECRET_LINKS,
  JWT_LINKS_EXPIRES_IN: process.env.JWT_LINKS_EXPIRES_IN,
};

// Export jwtConfig
module.exports = jwtConfig;
