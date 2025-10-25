const { connectDB } = require('../config/database');
const seedChallenges = require('./challengeSeeder');
const seedTips = require('./tipSeeder');
const seedExercises = require('./exerciseSeeder');

const runSeeders = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');
    
    // Connect to database
    await connectDB();
    
    // Run seeders
    await seedChallenges();
    await seedTips();
    await seedExercises();
    
    console.log('\n✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  runSeeders();
}

module.exports = runSeeders;