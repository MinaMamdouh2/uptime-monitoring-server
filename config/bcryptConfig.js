// Import enviroment variables
require('dotenv').config();

// Creating a bcrypt configuration object
const bcryptConfig = {
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS),
};

// Export bcryptConfig
module.exports = bcryptConfig;
