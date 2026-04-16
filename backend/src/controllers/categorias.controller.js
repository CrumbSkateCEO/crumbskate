const { pool } = require("../config/db");

// GET /api/categorias
async function listar(req, res, next) {
  try {
    const [categorias] = await pool.query(
      "SELECT id, nombre, descripcion FROM categorias ORDER BY nombre"
    );
    res.json(categorias);
  } catch (err) {
    next(err);
  }
}

// POST /api/categorias  (solo admin)
async function crear(req, res, next) {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre es requerido." });

    const [result] = await pool.query(
      "INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)",
      [nombre, descripcion || null]
    );
    res.status(201).json({ message: "Categoría creada.", id: result.insertId });
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, crear };
