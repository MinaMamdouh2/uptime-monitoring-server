// Import models
const models = require('../models');

// Import Logs model
const Logs = models.Logs;

const getReport = async (req, res) => {
  try {
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
          resultsCount: urlChecks.rows.length,
          totalCount: urlChecks.count,
        },
      },
    });
  } catch (err) {
    console.log(err);
    console.log('Catch - Reports Controller - getReport');
    res.status(400).json({
      message: 'Something went wrong!!',
    });
  }
};

// Export Controllers
module.exports = {
  getReport,
};
