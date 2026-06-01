import pool from './config/db';

async function migrate() {
  const conn = await pool.getConnection();
  try {
    console.log("Creando tabla cupones...");
    await conn.query(`
      CREATE TABLE IF NOT EXISTS cupones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        codigo VARCHAR(50) NOT NULL UNIQUE,
        descuento_porcentaje DECIMAL(5,2) NOT NULL,
        valido_hasta DATETIME,
        activo TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Creando tabla resenas...");
    await conn.query(`
      CREATE TABLE IF NOT EXISTS resenas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        producto_id INT NOT NULL,
        calificacion INT NOT NULL CHECK(calificacion BETWEEN 1 AND 5),
        comentario TEXT,
        aprobado TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
      )
    `);

    console.log("Creando tabla configuracion...");
    await conn.query(`
      CREATE TABLE IF NOT EXISTS configuracion (
        id INT AUTO_INCREMENT PRIMARY KEY,
        clave VARCHAR(100) NOT NULL UNIQUE,
        valor TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log("Insertando configuración inicial...");
    await conn.query(`
      INSERT IGNORE INTO configuracion (clave, valor) VALUES 
      ('costo_envio', '5000'), 
      ('mensaje_home', '¡Bienvenidos a CrumbSkate!')
    `);

    console.log("Migraciones completadas con éxito.");
  } catch (error) {
    console.error("Error en las migraciones:", error);
  } finally {
    conn.release();
    process.exit();
  }
}

migrate();
