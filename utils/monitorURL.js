// Import Models
const models = require('../models');
const URLChecks = models.URLChecks;

// Import httpClient
const httpClient = require('./httpClient');

// Import mail utils
const mailService = require('../utils/MailService');

const recursiveCallingURL = (checkId, interval, email) => {
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
      .then(async (res) => {
        if (urlCheck.trials === -1) {
          await URLChecks.update(
            { trials: urlCheck.threshold },
            {
              where: {
                id: checkId,
              },
            }
          );
          await mailService
            .sendMail(
              email,
              'Your URL is up again :)',
              `At last, your URL: ${url} is up again :)`
            )
            .then(() =>
              console.log(
                'Email sent successfully - recursiveCallingURL - Up Notification'
              )
            )
            .catch((err) => {
              console.log(err);
              console.log(
                'Catch - recursiveCallingURL - mail service - Up Notification'
              );
            });
        }
        console.log(res.status, urlCheck.url);
      })
      .catch(async (err) => {
        if (urlCheck.trials === 0) {
          await mailService
            .sendMail(
              email,
              'Your URL is down :(',
              `Unfortunately, your link: ${url} is down :(`
            )
            .then(() =>
              console.log(
                'Email sent successfully - recursiveCallingURL - Up Notification'
              )
            )
            .catch((err) => {
              console.log(err);
              console.log(
                'Catch - recursiveCallingURL - mail service - Up Notification'
              );
            });
        }
        if (urlCheck.trials >= 0) {
          await URLChecks.update(
            {
              trials: urlCheck.trials - 1,
            },
            { where: { id: checkId } }
          ).catch((err) => {
            console.log(err);
            console.log(`catch - catch err request - recursiveCallingURL`);
          });
        }
        if (err.code && err.code === 'ECONNABORTED') console.log('Timeout');
        console.log(err.response?.status ? err.response.status : 'err');
      });
  }, interval * 1000);
};

module.exports = recursiveCallingURL;
