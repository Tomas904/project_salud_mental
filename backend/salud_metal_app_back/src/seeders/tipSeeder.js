const { Tip } = require('../models');

const tipsData = [
  {
    title: 'Duerme 7-8 horas',
    description: 'El sueño adecuado es fundamental para tu salud mental y física. Establece una rutina de sueño consistente.',
    category: 'sueño',
    icon: '😴',
    isActive: true
  },
  {
    title: 'Mantén contacto social',
    description: 'Las relaciones positivas son clave para el bienestar emocional. Dedica tiempo a conectar con amigos y familia.',
    category: 'social',
    icon: '👥',
    isActive: true
  },
  {
    title: 'Practica la gratitud',
    description: 'Reconocer lo positivo mejora tu perspectiva y estado de ánimo. Escribe 3 cosas por las que estás agradecido cada día.',
    category: 'gratitud',
    icon: '🙏',
    isActive: true
  },
  {
    title: 'Haz ejercicio regularmente',
    description: 'La actividad física libera endorfinas que mejoran tu humor. Busca una actividad que disfrutes.',
    category: 'ejercicio',
    icon: '💪',
    isActive: true
  },
  {
    title: 'Limita el tiempo en redes',
    description: 'Desconectarte ayuda a reducir la ansiedad y el estrés. Establece horarios sin pantallas.',
    category: 'digital',
    icon: '📱',
    isActive: true
  },
  {
    title: 'Come balanceado',
    description: 'Una nutrición adecuada impacta directamente en tu estado de ánimo. Incluye frutas, verduras y proteínas.',
    category: 'nutricion',
    icon: '🥗',
    isActive: true
  },
  {
    title: 'Practica mindfulness',
    description: 'La atención plena reduce el estrés y mejora la concentración. Dedica 5-10 minutos diarios.',
    category: 'mindfulness',
    icon: '🧘',
    isActive: true
  },
  {
    title: 'Establece rutinas',
    description: 'Las rutinas saludables proporcionan estructura y estabilidad. Crea hábitos que te beneficien.',
    category: 'sueño',
    icon: '⏰',
    isActive: true
  },
  {
    title: 'Sal al aire libre',
    description: 'La naturaleza tiene efectos calmantes. Pasa al menos 20 minutos al día en exteriores.',
    category: 'ejercicio',
    icon: '🌳',
    isActive: true
  },
  {
    title: 'Expresa tus emociones',
    description: 'Escribir o hablar sobre tus sentimientos ayuda a procesarlos. Mantén un diario emocional.',
    category: 'mindfulness',
    icon: '✍️',
    isActive: true
  },
  {
    title: 'Aprende algo nuevo',
    description: 'Mantener la mente activa mejora el bienestar. Dedica tiempo a un hobby o habilidad nueva.',
    category: 'mindfulness',
    icon: '📚',
    isActive: true
  },
  {
    title: 'Hidrátate adecuadamente',
    description: 'El agua es esencial para tu bienestar físico y mental. Bebe al menos 8 vasos al día.',
    category: 'nutricion',
    icon: '💧',
    isActive: true
  },
  {
    title: 'Respira profundamente',
    description: 'La respiración consciente activa el sistema nervioso parasimpático. Practica técnicas de respiración.',
    category: 'mindfulness',
    icon: '💨',
    isActive: true
  },
  {
    title: 'Ayuda a otros',
    description: 'El altruismo aumenta la felicidad. Realiza actos de bondad regularmente.',
    category: 'social',
    icon: '❤️',
    isActive: true
  },
  {
    title: 'Limita la cafeína',
    description: 'El exceso de cafeína puede aumentar la ansiedad. Modera su consumo, especialmente por la tarde.',
    category: 'nutricion',
    icon: '☕',
    isActive: true
  }
];

const seedTips = async () => {
  try {
    console.log('🌱 Seeding tips...');
    
    const count = await Tip.count();
    
    if (count > 0) {
      console.log('⚠️  Tips already exist, skipping...');
      return;
    }
    
    await Tip.bulkCreate(tipsData);
    console.log(`✅ ${tipsData.length} tips seeded successfully`);
  } catch (error) {
    console.error('❌ Error seeding tips:', error);
    throw error;
  }
};

module.exports = seedTips;