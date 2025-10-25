const User = require('./User');
const Emotion = require('./Emotion');
const JournalEntry = require('./JournalEntry');
const Challenge = require('./Challenge');
const UserChallenge = require('./UserChallenge');
const Medal = require('./Medal');
const Tip = require('./Tip');
const FavoriteTip = require('./FavoriteTip');
const Exercise = require('./Exercise');
const UserExercise = require('./UserExercise');
const NotificationSettings = require('./NotificationSettings');

// User relationships
User.hasMany(Emotion, { foreignKey: 'userId', as: 'emotions', onDelete: 'CASCADE' });
User.hasMany(JournalEntry, { foreignKey: 'userId', as: 'journalEntries', onDelete: 'CASCADE' });
User.hasMany(UserChallenge, { foreignKey: 'userId', as: 'userChallenges', onDelete: 'CASCADE' });
User.hasMany(Medal, { foreignKey: 'userId', as: 'medals', onDelete: 'CASCADE' });
User.hasMany(FavoriteTip, { foreignKey: 'userId', as: 'favoriteTips', onDelete: 'CASCADE' });
User.hasMany(UserExercise, { foreignKey: 'userId', as: 'userExercises', onDelete: 'CASCADE' });
User.hasOne(NotificationSettings, { foreignKey: 'userId', as: 'notificationSettings', onDelete: 'CASCADE' });

// Emotion relationships
Emotion.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// JournalEntry relationships
JournalEntry.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Challenge relationships
Challenge.hasMany(UserChallenge, { foreignKey: 'challengeId', as: 'userChallenges' });
Challenge.hasMany(Medal, { foreignKey: 'challengeId', as: 'medals' });

// UserChallenge relationships
UserChallenge.belongsTo(User, { foreignKey: 'userId', as: 'user' });
UserChallenge.belongsTo(Challenge, { foreignKey: 'challengeId', as: 'challenge' });

// Medal relationships
Medal.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Medal.belongsTo(Challenge, { foreignKey: 'challengeId', as: 'challenge' });

// Tip relationships
Tip.hasMany(FavoriteTip, { foreignKey: 'tipId', as: 'favorites' });

// FavoriteTip relationships
FavoriteTip.belongsTo(User, { foreignKey: 'userId', as: 'user' });
FavoriteTip.belongsTo(Tip, { foreignKey: 'tipId', as: 'tip' });

// Exercise relationships
Exercise.hasMany(UserExercise, { foreignKey: 'exerciseId', as: 'userExercises' });

// UserExercise relationships
UserExercise.belongsTo(User, { foreignKey: 'userId', as: 'user' });
UserExercise.belongsTo(Exercise, { foreignKey: 'exerciseId', as: 'exercise' });

// NotificationSettings relationships
NotificationSettings.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  Emotion,
  JournalEntry,
  Challenge,
  UserChallenge,
  Medal,
  Tip,
  FavoriteTip,
  Exercise,
  UserExercise,
  NotificationSettings
};