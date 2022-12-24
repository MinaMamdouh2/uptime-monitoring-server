// Importing DB config
const { dbConfig } = require('../config');

// Import sequelize
const { Sequelize } = require('sequelize');

// Initializing Sequelize
const sequelize = new Sequelize(
  dbConfig.DATABASE_NAME,
  dbConfig.DB_USER,
  dbConfig.DB_PASSWORD,
  {
    logging: false,
    host: dbConfig.DB_HOST,
    dialect: dbConfig.DB_DIALECT,
  }
);

// Creating models Object
models = {};

// Establishing a connection to database
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database: ', error);
  });

// Load models
models.Users = require('./Users')(sequelize, Sequelize.DataTypes);
models.URLChecks = require('./URLChecks')(sequelize, Sequelize.DataTypes);
models.Reports = require('./Reports')(sequelize, Sequelize.DataTypes);

// Create associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(db);
  }
});

// Alter: true => migrate new columns to tables
// Force: false => table are not dropped then re-created
// Drop: removes columns from the table if it doesn't exist in the model
try {
  (async () => {
    await sequelize.sync({
      drop: true,
      alter: true,
      force: false,
    });
  })();
} catch (err) {
  console.log('Something went wrong while syncing db');
}

module.exports = models;
