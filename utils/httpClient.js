// Import Axios
const axios = require('axios');

const httpClient = (basicAuth, timeout, httpHeaders) => {
  return axios.create({
    withCredentials: true,
    timeout: 1000 * timeout,
    auth: basicAuth ? basicAuth : null,
    headers: {
      common: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      ...httpHeaders,
    },
  });
};

module.exports = httpClient;
