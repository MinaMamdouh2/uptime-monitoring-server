// Import enviroment variables
require('dotenv').config();

// Creating a db configuration object
const dbConfig = {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DATABASE_NAME: process.env.DATABASE_NAME,
  DB_PORT: process.env.DB_PORT,
  DB_DIALECT: 'mysql',
};

// Export dbConfig
module.exports = dbConfig;
