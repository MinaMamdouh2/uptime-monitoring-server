const axios = require('axios');

const httpClient = axios.create({
  withCredentials: true,
  headers: {
    common: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
});

module.exports = httpClient;
