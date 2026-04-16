const mysql = require("mysql2/promise");

// Pool de conexiones: reutiliza conexiones en vez de abrir una nueva por request
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,     // máximo 10 conexiones simultáneas
  queueLimit: 0,
  timezone: "-03:00",      // Argentina
});

// Verifica la conexión al iniciar
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Conexión a MySQL exitosa");
    conn.release();
  } catch (err) {
    console.error("❌ Error conectando a MySQL:", err.message);
    process.exit(1); // Detiene el servidor si no hay DB
  }
}

module.exports = { pool, testConnection };
