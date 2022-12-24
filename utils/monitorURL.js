// Import Models
const models = require('../models');
const URLChecks = models.URLChecks;

// Import httpClient
const httpClient = require('./httpClient');

const recursiveCallingURL = async (checkId) => {
  const urlCheck = await URLChecks.findByPk(checkId);

  // Check if url check exsits or is deleted or the user who created it is deleted
  if (!urlCheck || urlCheck.deletedAt || urlCheck.createdBy === null) return;

  setInterval(async () => {
    httpClient
      .get(
        `${urlCheck.protocol.toLowerCase()}://${urlCheck.url}${
          urlCheck.port ? `:${urlCheck.port}` : ''
        }${urlCheck.path ? urlCheck.path : ''}`,
        {},
        {
          auth: urlCheck.authentication ? urlCheck.authentication : null,
        }
      )
      .then((res) => console.log(res.status, urlCheck.url))
      .catch((err) => console.log(2));
  }, urlCheck.interval * 1000);
};

module.exports = recursiveCallingURL;
