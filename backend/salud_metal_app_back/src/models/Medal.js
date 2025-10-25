const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Medal = sequelize.define('Medal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  medalType: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'medal_type'
  },
  earnedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'earned_at'
  },
  challengeId: {
    type: DataTypes.UUID,
    field: 'challenge_id',
    references: {
      model: 'challenges',
      key: 'id'
    }
  }
}, {
  tableName: 'medals',
  timestamps: false,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['medal_type']
    }
  ]
});

module.exports = Medal;