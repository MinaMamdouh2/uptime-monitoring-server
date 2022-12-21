// Import enviroment variables
require('dotenv').config();

// Creating a db configuration object
const dbConfig = {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.root,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DATABASE_NAME: process.env.DATABASE_NAME,
  DB_PORT: process.env.DB_PORT,
};

// Export dbConfig
module.exports = dbConfig;