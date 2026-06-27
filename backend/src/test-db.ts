import prisma from './config/db';

async function testConnection() {
  try {
    await prisma.$queryRaw`SELECT 1 as result`;
    console.log('✅ Conexión a la base de datos exitosa (Prisma + Neon)');
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
