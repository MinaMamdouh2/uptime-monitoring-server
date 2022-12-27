// Import models
const models = require('../models');

// Import Logs model
const Logs = models.Logs;
const URLChecks = models.URLChecks;

const findOne = async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).json({
        message: 'Please provide an id',
      });
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const latestLog = await Logs.findOne({
      where: {
        check: id,
      },
      order: [['id', 'DESC']],
    });
    const timestamps = await Logs.findAndCountAll({
      where: {
        deletedAt: null,
        check: id,
      },
      limit: limit,
      offset: (page - 1) * limit,
      order: [['id', 'DESC']],
      attributes: {
        exclude: [
          'status',
          'available',
          'outages',
          'downtime',
          'uptime',
          'responseTime',
          'check',
          'updatedAt',
        ],
      },
    });
    const history = [];
    timestamps.rows.map((timestamp) => history.push(timestamp.createdAt));

    res.status(200).json({
      message: 'URL check report is generated',
      data: {
        status: latestLog.status,
        availability:
          (latestLog.available / (latestLog.available + latestLog.outages)) *
          100,
        outages: latestLog.outages,
        downtime: latestLog.downtime,
        uptime: latestLog.uptime,
        responseTime:
          latestLog.responseTime / (latestLog.available + latestLog.outages),
        timestamps: {
          history,
          resultsCount: timestamps.rows.length,
          totalCount: timestamps.count,
        },
      },
    });
  } catch (err) {
    console.log(err);
    console.log('Catch - Reports Controller - findOne');
    res.status(400).json({
      message: 'Something went wrong!!',
    });
  }
};

// Get All reports
const find = async (req, res) => {
  try {
    const urlCheckIds = req.urlChecks.rows.map((urlCheck) => urlCheck.id);
    let latestLogs = [];
    for (let i = 0; i < urlCheckIds.length; i++) {
      const latestLog = await Logs.findOne({
        where: {
          check: urlCheckIds[i],
        },
        include: [
          {
            model: URLChecks,
            as: 'urlCheck',
            attributes: ['tags'],
          },
        ],
        order: [['id', 'DESC']],
      });
      latestLogs.push(latestLog);
    }
    console.log(latestLogs[0]);
    const data = latestLogs.map((latestLog) => {
      return {
        urlCheckId: latestLog.check,
        status: latestLog.status,
        availability:
          (latestLog.available / (latestLog.available + latestLog.outages)) *
          100,
        outages: latestLog.outages,
        downtime: latestLog.downtime,
        uptime: latestLog.uptime,
        responseTime:
          latestLog.responseTime / (latestLog.available + latestLog.outages),
        tags: latestLog.urlCheck.tags,
      };
    });
    res.status(200).json({
      message: 'Fetched reports',
      data,
      resultsCount: data.length,
    });
  } catch (err) {
    console.log(err);
    console.log('Catch - Reports Controller - find');
    res.status(400).json({
      message: 'Something went wrong!!',
    });
  }
};

// Export Controllers
module.exports = {
  findOne,
  find,
};
