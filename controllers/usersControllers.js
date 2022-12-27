// Import nanoid for the UUID
const Nanoid = require('nanoid');

// Import models
const models = require('../models');

// Import Users model
const Users = models.Users;

// Create user
const create = async (req, res, next) => {
  try {
    if (!req.body.email && !req.body.password)
      return res.status(400).json({
        message: 'Either email or password are missing!',
      });
    const { email, password } = req.body;
    const user = await Users.findOne({
      where: {
        email,
      },
    });
    if (user)
      return res.status(400).json({
        message: 'Email already existed',
      });

    await Users.create({
      uuid: Nanoid.nanoid(),
      email,
      password,
      role: req.body.role ? req.body.role : 'user',
    }).then(() => {
      next();
    });
  } catch (err) {
    console.log(err);
    console.log('Catch - Users Controller - create');
    res.status(400).json({
      message: 'Something went wrong!!',
    });
  }
};

// Find all users
const findAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    await Users.findAndCountAll({
      where: {
        deletedAt: null,
      },
      limit: limit,
      offset: (page - 1) * limit,
      order: [['id', 'ASC']],
    }).then(async (results) => {
      res.status(200).json({
        message: 'Fetched users',
        users: results.rows,
        totalCount: results.count,
      });
    });
  } catch (err) {
    console.log(err);
    console.log('Catch - Users Controller - findAll');
    res.status(400).json({
      message: 'Something went wrong!!',
    });
  }
};

const findOne = async (req, res, next) => {
  try {
    if (!req.params.id)
      return res.status(400).json({
        message: 'Failed, please provide a user id',
      });

    const { id } = req.params;
    const user = await Users.findOne({
      where: {
        deletedAt: null,
        id,
      },
    });

    if (!user)
      return res.status(400).json({
        message: 'User not found',
      });
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    console.log('Catch - Users Controller - delete');
    res.status(400).json({
      message: 'Something went wrong!!',
    });
  }
};

// Return User returned from findOne middleware
const returnUser = async (req, res) => {
  try {
    res.status(200).json({
      message: 'Fetched user',
      user: req.user,
    });
  } catch (err) {
    console.log(err);
    console.log('Catch - Users Controller - delete');
    res.status(400).json({
      message: 'Something went wrong!!',
    });
  }
};
// Delete a specific URL check
const deleteOne = async (req, res) => {
  try {
    const { id } = req.params;

    await Users.update(
      {
        deletedAt: new Date(),
        deletedBy: req.currentUser.id,
      },
      {
        where: {
          id,
          deletedAt: null,
        },
      }
    );
    res.status(200).json({
      message: 'User has beed deleted!!',
    });
  } catch (err) {
    console.log(err);
    console.log('Catch - Users Controller - delete');
    res.status(400).json({
      message: 'Something went wrong!!',
    });
  }
};

module.exports = {
  create,
  findAll,
  findOne,
  returnUser,
  deleteOne,
};
