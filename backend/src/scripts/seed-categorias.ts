import pool from '../config/db';

const populate = async () => {
  try {
    const cats = ['Remeras', 'Buzos', 'Gorras', 'Medias', 'Bolsos', 'Accesorios'];
    for (const c of cats) {
      await pool.query('INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)', [c, 'Categoría base']);
    }
    console.log("Categorias agregadas con éxito.");
  } catch (error) {
    console.error("Error", error);
  } finally {
    process.exit(0);
  }
}

populate();
