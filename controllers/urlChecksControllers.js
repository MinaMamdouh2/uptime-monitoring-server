// Import nanoid for the UUID
const Nanoid = require('nanoid');

// Import models
const models = require('../models');

// Import Users model
const URLChecks = models.URLChecks;

// Import monitor URL
const monitorURL = require('../utils/monitorURL');

// Create URL Checks
const create = async (req, res) => {
  try {
    const check = await URLChecks.create({
      ...req.body,
      createdBy: req.currentUser.id,
    });
    monitorURL(check.id);
    res.status(200).json({
      message: 'Check created',
    });
  } catch (err) {
    const sqlError = err.errors ? err.errors[0] : null;
    if (
      sqlError &&
      sqlError.type === 'unique violation' &&
      sqlError.path === 'name'
    ) {
      return res.status(400).json({
        message: `Name check is already taken, please try another name. You can try this name: ${Nanoid.nanoid()} `,
      });
    }
    console.log(err);
    console.log('Catch - URL Check Controller - create');
    res.status(400).json({
      message: 'Something went wrong!!',
    });
  }
};

// Export controllers
module.exports = {
  create,
};
