// Importing cors
const cors = require('cors');

// Importing morgan
const morgan = require('morgan');

// Importing express
const express = require('express');

// Initializng app
const app = express();

// Intializing middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello from server!!',
  });
});

// Exporting app
module.exports = app;
