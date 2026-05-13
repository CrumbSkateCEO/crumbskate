import pool from './config/db';

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 as result');
    console.log('Conexión a MariaDB exitosa:', rows);
    process.exit(0);
  } catch (error) {
    console.error('Error conectando a MariaDB:', error);
    process.exit(1);
  }
}

testConnection();
