import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar variables de entorno si no se han cargado previamente
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'crumbskate',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
