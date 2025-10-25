const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserChallenge = sequelize.define('UserChallenge', {
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
  challengeId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'challenge_id',
    references: {
      model: 'challenges',
      key: 'id'
    }
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  currentDay: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'current_day'
  },
  completedDays: {
    type: DataTypes.JSONB,
    defaultValue: [],
    field: 'completed_days'
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_completed'
  },
  startedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'started_at'
  },
  completedAt: {
    type: DataTypes.DATE,
    field: 'completed_at'
  }
}, {
  tableName: 'user_challenges',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['user_id', 'is_completed']
    }
  ]
});

module.exports = UserChallenge;