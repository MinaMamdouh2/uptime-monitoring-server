// Import Models
const models = require('../models');
const URLChecks = models.URLChecks;
const Logs = models.Logs;

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

    const lastLog = await Logs.findOne({
      where: {
        check: urlCheck.id,
      },
      order: [['id', 'DESC']],
    });
    // Get current time
    const startTime = Date.now();
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
          if (urlCheck.webhook)
            httpClient(null, 5)
              .post(urlCheck.webhook, {
                message: `At last, your URL: ${url} is up again :)`,
              })
              .then(() =>
                console.log(
                  `Pushing to webhook ${urlCheck.webhook} -Up notification`
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

        console.log(res.status, urlCheck.url);
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
                'Email sent successfully - recursiveCallingURL - down Notification'
              )
            )
            .catch((err) => {
              console.log(err);
              console.log(
                'Catch - recursiveCallingURL - mail service -down Notification'
              );
            });
          if (urlCheck.webhook)
            httpClient(null, 5)
              .post(urlCheck.webhook, {
                message: `Unfortunately, your URL: ${url} is down :(`,
              })
              .then(() =>
                console.log(
                  `Pushing to webhook ${urlCheck.webhook} - down notification`
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
        if (err.code && err.code === 'ECONNABORTED') console.log('Timeout');
        console.log(err.response?.status ? err.response.status : 'err');
      });
  }, interval * 1000);
};

module.exports = recursiveCallingURL;
