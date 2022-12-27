// Import enviroment variables
require('dotenv').config();

// Creating nodemailer configuration object
const nodemailerConfig = {
  USER: process.env.USER,
  PASS: process.env.PASS,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN,
};

// Export nodemailerConfig
module.exports = nodemailerConfig;
