// Import lodash to manipulate JSON objects of the model
const _ = require('lodash');

// Import constants
const constants = require('../config/constants');

// Exporting User model
module.exports = (sequelize, DataTypes) => {
  const Logs = sequelize.define(
    'logs',
    {
      status: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isIn: [constants.status],
        },
      },

      available: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      outages: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      downtime: {
        type: DataTypes.FLOAT,
      },

      uptime: {
        type: DataTypes.FLOAT,
      },

      responseTime: {
        type: DataTypes.FLOAT,
      },

      check: {
        type: DataTypes.INTEGER,

        references: {
          model: 'url_checks',
          key: 'id',
        },

        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

      createdBy: {
        field: 'created_by',
        type: DataTypes.INTEGER,

        references: {
          model: 'users',
          key: 'id',
        },

        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
      },

      updatedBy: {
        field: 'updated_by',
        type: DataTypes.INTEGER,

        references: {
          model: 'users',
          key: 'id',
        },

        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      deletedAt: {
        field: 'deleted_at',
        type: DataTypes.DATE,
      },

      deletedBy: {
        field: 'deleted_by',
        type: DataTypes.INTEGER,

        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      // freezeTableName => stop the auto-pluralization
      // timestamps => turn off default timestamps & create custom
      freezeTableName: false,
      timestamps: false,
    }
  );

  // Association to fetch createdBy in object called creator
  Logs.belongsTo(models.URLChecks, {
    foreignKey: 'check',
    as: 'check_id',
  });

  // Association to fetch createdBy in object called creator
  Logs.belongsTo(models.Users, {
    foreignKey: 'createdBy',
    as: 'creator',
  });

  // Association to fetch updatedBy in object called editor
  Logs.belongsTo(models.Users, {
    foreignKey: 'updatedBy',
    as: 'editor',
  });

  // Association to fetch updatedBy in object called editor
  Logs.belongsTo(models.Users, {
    foreignKey: 'deletedBy',
    as: 'deleter',
  });

  // Remove these attributes from JSON object
  Logs.prototype.toJSON = function () {
    const attributes = {
      ..._.omit(
        this.get(),
        ['createdBy'],
        ['deletedBy'],
        ['deletedAt'],
        ['updatedBy']
      ),
    };
    return attributes;
  };

  return Logs;
};
