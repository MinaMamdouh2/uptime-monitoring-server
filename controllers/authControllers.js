// Import configurations
const configurations = require('../config/index');

// Import jwt module
const jwt = require('jsonwebtoken');

// Import Models
const models = require('../models');

// Import Users model
const Users = models.Users;

// Import mail utils
const mailService = require('../utils/MailService');

// Signin token with payload
const signToken = (payload, key, expiresIn) => {
  return jwt.sign(payload, key, {
    expiresIn,
  });
};

// Decode token with key
const decodeToken = (token, key) => {
  return jwt.verify(token, key);
};

// Authenticate logged in users
const authenticateUser = async (req, res, next) => {
  let jwtToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    jwtToken = req.headers.authorization.split(' ')[1];
  else
    return res.status(401).json({
      message: 'Unauthorized, please sign in',
    });
  let decodedJwtToken;
  try {
    decodedJwtToken = decodeToken(
      jwtToken,
      configurations.jwtConfig.JWT_SECRET
    );
  } catch (err) {
    switch (err.name) {
      case 'JsonWebTokenError':
        return res.status(401).json({
          message: 'Please sign in',
        });
      case 'TokenExpiredError':
        return res.status(401).json({
          message: 'Token expired, please sign in',
        });
    }
  }

  const user = await Users.findOne({
    where: {
      email: decodedJwtToken.email,
      deletedAt: null,
    },
  });
  if (user === null)
    return res.status(404).json({
      message: 'User has been deleted',
    });
  req.currentUser = {
    ...decodedJwtToken,
    id: user.id,
  };
  next();
};

// Authorize user for specific action
const authorizeUser = (role) => {
  return (req, res, next) => {
    if (req.currentUser.role !== role && role !== 'all')
      return res.status(403).json({
        message: `Permission denied`,
      });
    next();
  };
};

// Login user & send token with payload
const login = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password)
      return res.status(400).json({
        message: 'Please provide both email & password',
      });
    const { email, password } = req.body;
    const user = await Users.findOne({
      where: {
        email,
      },
    });
    if (!user)
      return res.status(400).json({
        message: 'User not found',
      });
    if (!user.verified)
      return res.status(400).json({
        message: 'Please verify your email',
      });
    if (user.deletedAt)
      return res.status(400).json({
        message: 'User has been deleted',
      });
    const correctPassword = await user.checkPassword(password);
    if (!correctPassword)
      return res.status(400).json({
        message: 'Either your email or password is incorrect',
      });
    const tokenPayload = {
      email,
      role: user.role,
      id: user.id,
    };
    const jwtToken = signToken(
      tokenPayload,
      configurations.jwtConfig.JWT_SECRET,
      configurations.jwtConfig.JWT_EXPIRES_IN
    );
    res.status(200).json({
      message: 'Login successful',
      jwtToken,
    });
  } catch (err) {
    console.log(err);
    console.log('Catch - Authentication Controller - login');
    res.status(400).json({
      message: 'Something went wrong!!',
    });
  }
};

// Send verification email to user
const sendVerificationEmail = async (req, res) => {
  try {
    if (!req.body.email)
      return res.status(400).json({
        message: 'Please enter an email!!',
      });
    const { email } = req.body;
    // Intializing token payload
    const user = await Users.findOne({
      where: {
        email,
      },
    });
    if (!user)
      return res.status(400).json({
        message: 'User not found',
      });
    if (user.deletedAt)
      return res.status(400).json({
        message: 'This user is deleted',
      });
    const tokenCriteria = {
      uuid: user.uuid,
    };
    const jwtToken = signToken(
      tokenCriteria,
      configurations.jwtConfig.JWT_SECRET_LINKS,
      configurations.jwtConfig.JWT_LINKS_EXPIRES_IN
    );

    await mailService
      .sendMail(
        email,
        'Account Activation',
        `Use this link ${jwtToken}to verify your email address.
    If you didn’t ask to verify this address, you can ignore this email`
      )
      .then(() => {
        res.status(200).json({
          message: 'Email sent successfully',
        });
      })
      .catch((err) => {
        console.log(err);
        console.log(
          'Catch - Authentication Controller - mail service -sendVerificationEmail'
        );
        res.status(400).json({
          message: 'Something went wrong!! Email was not sent try again later',
        });
      });
  } catch (err) {
    console.log(err);
    console.log('Catch - Authentication Controller - sendVerificationEmail');
    res.status(400).json({
      message: 'Something went wrong!!',
    });
  }
};

// Verify user email
const verifyEmail = async (req, res) => {
  try {
    if (!req.body.jwtToken)
      return res.status(400).json({
        message: 'Please send token',
      });
    const { jwtToken } = req.body;
    let decodedJwtToken;
    try {
      decodedJwtToken = decodeToken(
        jwtToken,
        configurations.jwtConfig.JWT_SECRET_LINKS
      );
    } catch (err) {
      switch (err.name) {
        case 'JsonWebTokenError':
          return res.status(401).json({
            message: 'Please sign in',
          });
        case 'TokenExpiredError':
          return res.status(401).json({
            message: 'Token expired, please sign in',
          });
      }
    }
    await Users.update(
      {
        verified: true,
      },
      {
        where: {
          uuid: decodedJwtToken.uuid,
        },
      }
    ).then(() => {
      res.status(200).json({
        message: `Your email has been verified`,
      });
    });
  } catch (err) {
    console.log(err);
    console.log('Catch - Authentication Controller - verifyEmail');
    res.status(400).json({
      message: 'Something went wrong!!',
    });
  }
};

module.exports = {
  authenticateUser,
  authorizeUser,
  login,
  sendVerificationEmail,
  verifyEmail,
};
