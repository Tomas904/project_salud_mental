const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserExercise = sequelize.define('UserExercise', {
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
  exerciseId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'exercise_id',
    references: {
      model: 'exercises',
      key: 'id'
    }
  },
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'completed_at'
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    field: 'duration_minutes'
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    }
  }
}, {
  tableName: 'user_exercises',
  timestamps: false,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['completed_at']
    }
  ]
});

module.exports = UserExercise;