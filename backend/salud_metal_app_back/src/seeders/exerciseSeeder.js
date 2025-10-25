const { Exercise } = require('../models');

const exercisesData = [
  {
    title: 'Meditación Básica',
    description: '5-10 minutos de meditación guiada para calmar la mente y reducir el estrés',
    type: 'meditacion',
    durationMinutes: 10,
    instructions: [
      'Siéntate en una posición cómoda con la espalda recta',
      'Cierra los ojos suavemente',
      'Respira profundamente por la nariz durante 5 segundos',
      'Mantén la respiración por 2 segundos',
      'Exhala lentamente por la boca durante 7 segundos',
      'Enfoca tu atención en tu respiración',
      'Si tu mente divaga, vuelve gentilmente al presente',
      'Repite el ciclo durante 10 minutos'
    ],
    icon: '🧘',
    isActive: true
  },
  {
    title: 'Respiración 4-7-8',
    description: 'Técnica de respiración para reducir el estrés y facilitar el sueño',
    type: 'respiracion',
    durationMinutes: 5,
    instructions: [
      'Siéntate cómodamente o acuéstate',
      'Coloca la punta de tu lengua detrás de los dientes superiores',
      'Exhala completamente por la boca',
      'Cierra la boca e inhala por la nariz contando hasta 4',
      'Mantén la respiración contando hasta 7',
      'Exhala completamente por la boca contando hasta 8',
      'Repite el ciclo 4 veces'
    ],
    icon: '💨',
    isActive: true
  },
  {
    title: 'Estiramientos Matutinos',
    description: 'Rutina de estiramientos suaves para comenzar el día con energía',
    type: 'estiramiento',
    durationMinutes: 8,
    instructions: [
      'Estira los brazos hacia arriba por 10 segundos',
      'Gira el cuello suavemente en círculos',
      'Estira los hombros hacia atrás 5 veces',
      'Inclínate hacia los lados, manteniendo 10 segundos cada lado',
      'Toca los dedos de los pies (o hasta donde llegues)',
      'Gira la cintura de lado a lado',
      'Estira las piernas una a la vez',
      'Respira profundamente entre cada estiramiento'
    ],
    icon: '🤸',
    isActive: true
  },
  {
    title: 'Meditación Guiada Avanzada',
    description: 'Sesión profunda de meditación para practicantes regulares',
    type: 'meditacion',
    durationMinutes: 20,
    instructions: [
      'Encuentra un lugar tranquilo sin interrupciones',
      'Siéntate en posición de loto o semi-loto',
      'Cierra los ojos y relaja todo tu cuerpo',
      'Observa tu respiración sin intentar controlarla',
      'Escanea tu cuerpo de pies a cabeza',
      'Libera tensiones en cada parte',
      'Permite que los pensamientos pasen como nubes',
      'Permanece en el presente durante 20 minutos'
    ],
    icon: '🧘‍♂️',
    isActive: true
  },
  {
    title: 'Respiración Box (Cuadrada)',
    description: 'Técnica utilizada por militares para manejar el estrés',
    type: 'respiracion',
    durationMinutes: 7,
    instructions: [
      'Siéntate con la espalda recta',
      'Exhala completamente',
      'Inhala contando hasta 4',
      'Sostén la respiración contando hasta 4',
      'Exhala contando hasta 4',
      'Sostén sin aire contando hasta 4',
      'Repite el ciclo 5-10 veces'
    ],
    icon: '💨',
    isActive: true
  },
  {
    title: 'Yoga Suave',
    description: 'Secuencia básica de yoga para flexibilidad y relajación',
    type: 'estiramiento',
    durationMinutes: 15,
    instructions: [
      'Comienza en postura de montaña (Tadasana)',
      'Pasa a postura del niño (Balasana) por 1 minuto',
      'Postura del gato-vaca (5 repeticiones)',
      'Perro boca abajo (1 minuto)',
      'Guerrero I (30 segundos cada lado)',
      'Triángulo extendido (30 segundos cada lado)',
      'Postura sentada de torsión',
      'Finaliza con Savasana (2 minutos)'
    ],
    icon: '🧘‍♀️',
    isActive: true
  }
];

const seedExercises = async () => {
  try {
    console.log('🌱 Seeding exercises...');
    
    const count = await Exercise.count();
    
    if (count > 0) {
      console.log('⚠️  Exercises already exist, skipping...');
      return;
    }
    
    await Exercise.bulkCreate(exercisesData);
    console.log(`✅ ${exercisesData.length} exercises seeded successfully`);
  } catch (error) {
    console.error('❌ Error seeding exercises:', error);
    throw error;
  }
};

module.exports = seedExercises;