const axios = require('axios');

const httpClient = (basicAuth, timeout) => {
  return axios.create({
    withCredentials: true,
    timeout: 1000 * timeout,
    auth: basicAuth ? basicAuth : null,
    headers: {
      common: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  });
};

module.exports = httpClient;
