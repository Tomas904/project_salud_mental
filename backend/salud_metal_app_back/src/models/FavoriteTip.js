const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FavoriteTip = sequelize.define('FavoriteTip', {
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
  tipId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'tip_id',
    references: {
      model: 'tips',
      key: 'id'
    }
  }
}, {
  tableName: 'favorite_tips',
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'tip_id']
    }
  ]
});

module.exports = FavoriteTip;