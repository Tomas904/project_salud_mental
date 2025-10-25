const { Challenge } = require('../models');

const challengesData = [
  {
    title: 'Gratitud Diaria',
    description: 'Escribe 3 cosas por las que estás agradecido cada día',
    durationDays: 7,
    type: 'weekly',
    isActive: true
  },
  {
    title: 'Meditación Matutina',
    description: 'Medita 10 minutos cada mañana durante 21 días',
    durationDays: 21,
    type: 'monthly',
    isActive: true
  },
  {
    title: 'Hidratación Consciente',
    description: 'Bebe 8 vasos de agua al día durante 30 días',
    durationDays: 30,
    type: 'monthly',
    isActive: true
  },
  {
    title: 'Desconexión Digital',
    description: 'Sin pantallas 1 hora antes de dormir durante 14 días',
    durationDays: 14,
    type: 'weekly',
    isActive: true
  },
  {
    title: 'Ejercicio Diario',
    description: 'Realiza 30 minutos de actividad física cada día',
    durationDays: 30,
    type: 'monthly',
    isActive: true
  },
  {
    title: 'Lectura Nocturna',
    description: 'Lee 15 minutos antes de dormir cada noche',
    durationDays: 21,
    type: 'monthly',
    isActive: true
  },
  {
    title: 'Respiración Consciente',
    description: 'Practica ejercicios de respiración 3 veces al día',
    durationDays: 7,
    type: 'weekly',
    isActive: true
  }
];

const seedChallenges = async () => {
  try {
    console.log('🌱 Seeding challenges...');
    
    // Check if challenges already exist
    const count = await Challenge.count();
    
    if (count > 0) {
      console.log('⚠️  Challenges already exist, skipping...');
      return;
    }
    
    await Challenge.bulkCreate(challengesData);
    console.log(`✅ ${challengesData.length} challenges seeded successfully`);
  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
    throw error;
  }
};

module.exports = seedChallenges;