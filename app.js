// Importing cors
const cors = require('cors');

// Importing morgan
const morgan = require('morgan');

// Importing express
const express = require('express');

// Importing router
const router = require('./routes');

// Initializng app
const app = express();

// Intializing middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Adding middleware routes
app.use('/users', router.usersRouter);
app.use('/auth', router.authRouter);
app.use('/checks', router.urlChecksRouter);
app.use('/reports', router.reportsRouter);

app.all('*', (req, res) => {
  return res.status(404).json({
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Exporting app
module.exports = app;
