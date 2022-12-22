// Import lodash to manipulate JSON objects of the model
const _ = require('lodash');

// Import constants
const constants = require('../config/constants');

// Import bcrypt
const bcrypt = require('bcrypt');

// Import bcrypt configuration
const configurations = require('../config');

// Exporting User model
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'users',
    {
      uuid: {
        allowNull: false,
        type: DataTypes.STRING,
      },

      email: {
        allowNull: false,
        type: DataTypes.STRING,

        validate: {
          isEmail: {
            msg: 'Please enter a valid email',
          },
        },
      },

      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },

      verified: {
        defaultValue: 0,
        allowNull: false,
        field: 'is_verified',
        type: DataTypes.BOOLEAN,
      },

      role: {
        allowNull: false,
        defaultValue: 'user',
        type: DataTypes.STRING,
        validate: {
          isIn: [constants.roles],
        },
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

  //Adding hooks
  // Before create hook
  Users.beforeCreate(async (user, options) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(
        configurations.bcryptConfig.SALT_ROUNDS
      );
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
    }
  });

  // Before update hook
  Users.beforeUpdate(async (user, options) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(
        configurations.bcryptConfig.SALT_ROUNDS
      );
      const hash = bcrypt.hash(user.password, salt);
      user.password = hash;
    }
  });

  // Adding bcrypt compare password to User prototype
  Users.prototype.checkPassword = async function (submittedPassword) {
    return await bcrypt.compare(submittedPassword, this.password);
  };

  // Remove these attributes from JSON object
  Users.prototype.toJSON = function () {
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

  return Users;
};
