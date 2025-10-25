const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Exercise = sequelize.define('Exercise', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('meditacion', 'respiracion', 'estiramiento'),
    allowNull: false
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'duration_minutes'
  },
  instructions: {
    type: DataTypes.JSONB
  },
  icon: {
    type: DataTypes.STRING(100)
  },
  videoUrl: {
    type: DataTypes.STRING(500),
    field: 'video_url'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'exercises',
  updatedAt: false,
  indexes: [
    {
      fields: ['type']
    },
    {
      fields: ['is_active']
    }
  ]
});

module.exports = Exercise;