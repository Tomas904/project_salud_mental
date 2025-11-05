const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Notification settings for a user (one-to-one)
const NotificationSettings = sequelize.define('NotificationSettings', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    unique: true,
    references: { model: 'users', key: 'id' }
  },
  dailyReminder: {
    type: DataTypes.BOOLEAN,
    field: 'daily_reminder',
    defaultValue: true
  },
  reminderTime: {
    type: DataTypes.STRING,
    field: 'reminder_time',
    defaultValue: '09:00'
  },
  challengeNotifications: {
    type: DataTypes.BOOLEAN,
    field: 'challenge_notifications',
    defaultValue: true
  },
  tipsNotifications: {
    type: DataTypes.BOOLEAN,
    field: 'tips_notifications',
    defaultValue: true
  },
  emailNotifications: {
    type: DataTypes.BOOLEAN,
    field: 'email_notifications',
    defaultValue: true
  },
  pushNotifications: {
    type: DataTypes.BOOLEAN,
    field: 'push_notifications',
    defaultValue: true
  }
}, {
  tableName: 'notification_settings',
  // En algunos entornos la tabla ya existe sin columnas created_at/updated_at
  // Para evitar errores de INSERT, desactivamos timestamps.
  timestamps: false
});

module.exports = NotificationSettings;