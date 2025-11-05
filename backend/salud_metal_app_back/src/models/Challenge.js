const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Challenge = sequelize.define('Challenge', {
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
  durationDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'duration_days'
  },
  type: {
    type: DataTypes.ENUM('weekly', 'monthly', 'special'),
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATEONLY,
    field: 'start_date'
  },
  endDate: {
    type: DataTypes.DATEONLY,
    field: 'end_date'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'challenges',
  // La tabla puede no incluir created_at/updated_at; desactivar para evitar SELECT inválidos
  timestamps: false,
  indexes: [
    {
      fields: ['is_active']
    },
    {
      fields: ['type']
    }
  ]
});

module.exports = Challenge;