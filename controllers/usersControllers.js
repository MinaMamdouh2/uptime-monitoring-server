// Import nanoid for the UUID
const Nanoid = require('nanoid');

// Import models
const models = require('../models');

// Import Users model
const Users = models.Users;

// Create user
const create = async (req, res) => {
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
    }).then((user) =>
      res.status(200).json({
        message: 'User created',
        user,
      })
    );
  } catch (err) {
    console.log(err);
    console.log('Catch - Users Controller - findAll');
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

module.exports = {
  create,
  findAll,
};
