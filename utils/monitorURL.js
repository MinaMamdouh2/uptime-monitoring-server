// Import Models
const models = require('../models');
const URLChecks = models.URLChecks;

// Import httpClient
const httpClient = require('./httpClient');

const recursiveCallingURL = (checkId, interval) => {
  setInterval(async () => {
    const urlCheck = await URLChecks.findByPk(checkId);
    // Check if url check exsits or is deleted or the user who created it is deleted
    if (!urlCheck || urlCheck.deletedAt || urlCheck.createdBy === null)
      return clearInterval(this);
    const url = `${urlCheck.protocol.toLowerCase()}://${urlCheck.url}${
      urlCheck.port ? `:${urlCheck.port}` : ''
    }${urlCheck.path ? urlCheck.path : ''}`;
    httpClient(urlCheck.authentication, urlCheck.timeout)
      .get(url)
      .then((res) => console.log(res.status, urlCheck.url))
      .catch((err) => {
        if (err.code && err.code === 'ECONNABORTED') console.log('Timeout');
        console.log(err.response?.status, 'err');
      });
  }, interval * 1000);
};

module.exports = recursiveCallingURL;
