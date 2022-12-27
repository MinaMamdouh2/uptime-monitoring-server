// Import Models
const models = require('../models');
const URLChecks = models.URLChecks;
const Logs = models.Logs;

// Import httpClient
const httpClient = require('./httpClient');

// Import https
const https = require('https');
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

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

    const lastLog = await Logs.findOne({
      where: {
        check: urlCheck.id,
      },
      order: [['id', 'DESC']],
    });
    // Get current time
    const startTime = Date.now();
    httpClient(urlCheck.authentication, urlCheck.timeout, urlCheck.httpHeaders)
      .get(url, { httpsAgent: urlCheck.ignoreSSL ? httpsAgent : null })
      .then(async (res) => {
        if (urlCheck.assert?.statusCode) {
          if (res.status && urlCheck.assert.statusCode !== res.status)
            throw new Error(`Assertion Error ${res.status}`);
        }
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
                `Email sent successfully - recursiveCallingURL - Up Notification - URL: ${url} - URL Check ID ${checkId}`
              )
            )
            .catch((err) => {
              console.log(err);
              console.log(
                'Catch - recursiveCallingURL - mail service - Up Notification'
              );
            });
          if (urlCheck.webhook)
            httpClient(null, 5, null)
              .post(
                urlCheck.webhook,
                {
                  message: `At last, your URL: ${url} is up again :)`,
                },
                { httpsAgent: urlCheck.ignoreSSL ? httpsAgent : null }
              )
              .then(() =>
                console.log(
                  `Pushing to webhook ${urlCheck.webhook} -Up notification - URL: ${url} - URL Check ID ${checkId}`
                )
              )
              .catch((err) => {
                console.log(err);
                console.log(
                  'Catch - recursiveCallingURL - pushing service - Up Notification'
                );
              });
        }
        await Logs.create({
          check: checkId,
          status: 'available',
          outages: lastLog ? lastLog.outages : 0,
          available: lastLog ? lastLog.available + 1 : 1,
          uptime: lastLog
            ? lastLog.status === 'available'
              ? Math.abs(Date.now() - lastLog.createdAt) / 1000 + lastLog.uptime
              : lastLog.uptime
            : 0,
          downtime: lastLog ? lastLog.downtime : 0,
          responseTime: lastLog
            ? lastLog.responseTime + Math.abs(Date.now() - startTime) / 1000
            : Math.abs(Date.now() - startTime) / 1000,
        });

        console.log(`UP - URL: ${url} - URL Check ID ${checkId}`);
      })
      .catch(async (err) => {
        await Logs.create({
          check: checkId,
          status: 'down',
          available: lastLog ? lastLog.available : 0,
          outages: lastLog ? lastLog.outages + 1 : 1,
          uptime: lastLog ? lastLog.uptime : 0,
          downtime: lastLog
            ? lastLog.status === 'down'
              ? Math.abs(Date.now() - lastLog.createdAt) / 1000 +
                lastLog.downtime
              : lastLog.downtime
            : 0,
          responseTime: lastLog
            ? lastLog.responseTime + Math.abs(Date.now() - startTime) / 1000
            : Math.abs(Date.now() - startTime) / 1000,
        });
        if (urlCheck.trials === 0) {
          await mailService
            .sendMail(
              email,
              'Your URL is down :(',
              `Unfortunately, your URL: ${url} is down :(`
            )
            .then(() =>
              console.log(
                `Email sent successfully - recursiveCallingURL - down Notification - URL: ${url} - URL Check ID ${checkId}`
              )
            )
            .catch((err) => {
              console.log(err);
              console.log(
                'Catch - recursiveCallingURL - mail service -down Notification'
              );
            });
          if (urlCheck.webhook)
            httpClient(null, 5, null)
              .post(
                urlCheck.webhook,
                {
                  message: `Unfortunately, your URL: ${url} is down :(`,
                },
                { httpsAgent: urlCheck.ignoreSSL ? httpsAgent : null }
              )
              .then(() =>
                console.log(
                  `Pushing to webhook ${urlCheck.webhook} - down notification - URL: ${url} - URL Check ID ${checkId}`
                )
              )
              .catch((err) => {
                console.log(err);
                console.log(
                  'Catch - recursiveCallingURL - pushing service - down Notification'
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

        if (err.code && err.code === 'ECONNABORTED')
          console.log(`DOWN - timeout - ${url} - URL Check ID ${checkId}`);
        else if (err.message?.includes('Assertion Error'))
          console.log(
            `DOWN - Assertion failed - Assert status code ${
              urlCheck.assert.statusCode
            } - Response status code ${err.message.replace(
              'Assertion Error ',
              ''
            )} - URL: ${url} - URL Check ID ${checkId}`
          );
        else console.log(`DOWN -  ${url} - URL Check ID ${checkId}`);
      });
  }, interval * 1000);
};

module.exports = recursiveCallingURL;
