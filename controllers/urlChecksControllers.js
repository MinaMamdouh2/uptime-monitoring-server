// Import nanoid for the UUID
const Nanoid = require('nanoid');

// Import sequelize operator
const { Op } = require('sequelize');

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
      trials: req.body.threshold ? req.body.threshold : 1,
      createdBy: req.currentUser.id,
    });
    monitorURL(check.id, check.interval, req.currentUser.email);
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
        message: `Name check is already taken, please try another name. You can try this name: ${Nanoid.nanoid()}`,
      });
    }
    console.log(err);
    console.log('Catch - URL Check Controller - create');
    res.status(400).json({
      message: 'Something went wrong!!',
    });
  }
};

// Update a specific URL check using id
const updateOne = async (req, res) => {
  try {
    const { id } = req.params;

    await URLChecks.update(
      { ...req.body },
      {
        where: {
          id,
          createdBy: req.currentUser.id,
          deletedAt: null,
        },
      }
    );
    res.status(200).json({
      message: 'URL Check has been updated!!',
    });
  } catch (err) {
    console.log(err);
    console.log('Catch - URL Check Controller - update');
    res.status(400).json({
      message: 'Something went wrong!!',
    });
  }
};

// Return URL Check from findOne controller
const returnUrlCheck = async (req, res) => {
  try {
    res.status(200).json({
      message: 'Success',
      urlCheck: req.urlCheck,
    });
  } catch (err) {
    console.log(err);
    console.log('Catch - URL Check Controller - returnUrlCheck');
    res.status(400).json({
      message: 'Something went wrong!!',
    });
  }
};

// Find a specific URL check using id
const findOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const urlCheck = await URLChecks.findOne({
      where: {
        id,
        deletedAt: null,
        createdBy: req.currentUser.id,
      },
    });
    if (!urlCheck)
      return res.status(404).json({
        message: 'URL Check not found',
      });
    req.urlCheck = urlCheck;
    next();
  } catch (err) {
    console.log(err);
    console.log('Catch - URL Check Controller - findOne');
    res.status(400).json({
      message: 'Something went wrong!!',
    });
  }
};

// Find all urls
const find = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const tags = req.query.tags || [];
    let orParams;

    if (typeof tags === 'object')
      orParams = tags.map((tag) => {
        return { [Op.substring]: tag };
      });
    if (typeof tags === 'string') orParams = { [Op.substring]: tags };

    const whereParams = orParams
      ? {
          deletedAt: null,
          createdBy: req.currentUser.id,
          tags: {
            [Op.or]: orParams,
          },
        }
      : { deletedAt: null, createdBy: req.currentUser.id };

    const urlChecks = await URLChecks.findAndCountAll({
      where: {
        ...whereParams,
      },
      limit: limit,
      offset: (page - 1) * limit,
      order: [['id', 'ASC']],
    });
    req.urlChecks = urlChecks;
    next();
  } catch (err) {
    console.log(err);
    console.log('Catch - URL Check Controller - find');
    res.status(400).json({
      message: 'Something went wrong!!',
    });
  }
};

// Return URL Checks from find controller
const returnUrlChecks = async (req, res) => {
  try {
    res.status(200).json({
      message: 'Fetched URL checks',
      urlChecks: req.urlChecks.rows,
      resultsCount: req.urlChecks.rows.length,
      totalCount: req.urlChecks.count,
    });
  } catch (err) {
    console.log(err);
    console.log('Catch - URL Check Controller - returnURLChecks');
    res.status(400).json({
      message: 'Something went wrong!!',
    });
  }
};

// Delete a specific URL check
const deleteOne = async (req, res) => {
  try {
    const { id } = req.params;

    await URLChecks.update(
      {
        deletedAt: new Date(),
        deletedBy: req.currentUser.id,
      },
      {
        where: {
          id,
          deletedAt: null,
          createdBy: req.currentUser.id,
        },
      }
    );
    res.status(200).json({
      message: 'URL Check has beed deleted!!',
    });
  } catch (err) {
    console.log(err);
    console.log('Catch - URL Check Controller - findOne');
    res.status(400).json({
      message: 'Something went wrong!!',
    });
  }
};

// Export controllers
module.exports = {
  create,
  updateOne,
  findOne,
  find,
  deleteOne,
  returnUrlCheck,
  returnUrlChecks,
};
