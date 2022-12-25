// Import lodash to manipulate JSON objects of the model
const _ = require('lodash');

// Import constants
const constants = require('../config/constants');

// Exporting User model
module.exports = (sequelize, DataTypes) => {
  const URLChecks = sequelize.define(
    'url_checks',
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: 'name',
      },

      url: {
        allowNull: false,
        type: DataTypes.STRING,
      },

      protocol: {
        allowNull: false,
        type: DataTypes.STRING,
        set(value) {
          this.setDataValue('protocol', value.toUpperCase());
        },
        validate: {
          isIn: [constants.protocol],
        },
      },

      path: {
        type: DataTypes.STRING,
      },

      port: {
        type: DataTypes.INTEGER,
      },

      webhook: {
        type: DataTypes.STRING,
      },

      timeout: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
      },

      interval: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
      },

      threshold: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },

      authentication: {
        type: DataTypes.JSON,
        get() {
          return JSON.parse(this.getDataValue('authentication'));
        },
        set(value) {
          this.setDataValue('authentication', JSON.stringify(value));
        },
      },

      httpHeaders: {
        type: DataTypes.JSON,
        field: 'https_headers',
        get() {
          return JSON.parse(this.getDataValue('httpHeaders'));
        },
        set(value) {
          this.setDataValue('httpHeaders', JSON.stringify(value));
        },
      },

      assert: {
        type: DataTypes.JSON,
        get() {
          return JSON.parse(this.getDataValue('assert'));
        },
        set(value) {
          this.setDataValue('assert', JSON.stringify(value));
        },
      },

      tags: {
        type: DataTypes.STRING,
        get() {
          return this.getDataValue('tags').split(';');
        },
        set(value) {
          this.setDataValue('tags', value.join(';'));
        },
      },

      ignoreSSL: {
        field: 'ignore_ssl',
        type: DataTypes.BOOLEAN,
        allowNull: false,
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
  URLChecks.belongsTo(models.Users, {
    foreignKey: 'createdBy',
    as: 'creator',
  });

  // Association to fetch updatedBy in object called editor
  URLChecks.belongsTo(models.Users, {
    foreignKey: 'updatedBy',
    as: 'editor',
  });

  // Association to fetch updatedBy in object called editor
  URLChecks.belongsTo(models.Users, {
    foreignKey: 'deletedBy',
    as: 'deleter',
  });

  // Remove these attributes from JSON object
  URLChecks.prototype.toJSON = function () {
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

  return URLChecks;
};
