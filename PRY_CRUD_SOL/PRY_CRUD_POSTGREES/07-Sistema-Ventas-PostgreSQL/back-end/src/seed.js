require('dotenv').config();
const { sequelize } = require('./config/database');
const seedDatabase = require('./seeders/seed');

const runSeed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');
    
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados');
    
    await seedDatabase();
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

runSeed();
