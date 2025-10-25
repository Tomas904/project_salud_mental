const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Emotion = sequelize.define('Emotion', {
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
  emotionType: {
    type: DataTypes.ENUM('feliz', 'tranquilo', 'neutral', 'triste', 'molesto', 'ansioso'),
    allowNull: false,
    field: 'emotion_type'
  },
  intensity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 10
    }
  },
  note: {
    type: DataTypes.TEXT
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName: 'emotions',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'date']
    },
    {
      fields: ['user_id', 'date']
    },
    {
      fields: ['date']
    }
  ]
});

module.exports = Emotion;