const { pool } = require("../config/db");
const { validationResult } = require("express-validator");

// GET /api/productos  - listar con filtros opcionales
async function listar(req, res, next) {
  try {
    const { categoria_id, marca, buscar, pagina = 1, limite = 12 } = req.query;
    const offset = (parseInt(pagina) - 1) * parseInt(limite);

    let query = `
      SELECT p.id, p.nombre, p.descripcion, p.marca, p.codigo_sku,
             p.precio_base, p.imagen_url, p.mercadolibre_url,
             c.nombre AS categoria
      FROM productos p
      JOIN categorias c ON p.categoria_id = c.id
      WHERE p.activo = 1
    `;
    const params = [];

    if (categoria_id) {
      query += " AND p.categoria_id = ?";
      params.push(categoria_id);
    }
    if (marca) {
      query += " AND p.marca = ?";
      params.push(marca);
    }
    if (buscar) {
      query += " AND (p.nombre LIKE ? OR p.descripcion LIKE ?)";
      params.push(`%${buscar}%`, `%${buscar}%`);
    }

    query += " ORDER BY p.id DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limite), offset);

    const [productos] = await pool.query(query, params);
    res.json(productos);
  } catch (err) {
    next(err);
  }
}

// GET /api/productos/:id  - detalle con variantes
async function detalle(req, res, next) {
  try {
    const [productos] = await pool.query(
      `SELECT p.*, c.nombre AS categoria
       FROM productos p
       JOIN categorias c ON p.categoria_id = c.id
       WHERE p.id = ? AND p.activo = 1`,
      [req.params.id]
    );

    if (productos.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    const [variantes] = await pool.query(
      "SELECT id, talla, color, stock, precio_extra FROM variantes WHERE producto_id = ?",
      [req.params.id]
    );

    res.json({ ...productos[0], variantes });
  } catch (err) {
    next(err);
  }
}

// POST /api/productos  (solo admin)
async function crear(req, res, next) {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { categoria_id, nombre, descripcion, marca, codigo_sku,
            precio_base, imagen_url, mercadolibre_url } = req.body;

    const [result] = await pool.query(
      `INSERT INTO productos
        (categoria_id, nombre, descripcion, marca, codigo_sku, precio_base, imagen_url, mercadolibre_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [categoria_id, nombre, descripcion, marca, codigo_sku,
       precio_base, imagen_url || null, mercadolibre_url || null]
    );

    res.status(201).json({ message: "Producto creado.", id: result.insertId });
  } catch (err) {
    next(err);
  }
}

// PUT /api/productos/:id  (solo admin)
async function actualizar(req, res, next) {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { nombre, descripcion, marca, precio_base, imagen_url,
            mercadolibre_url, activo } = req.body;

    await pool.query(
      `UPDATE productos SET
        nombre = COALESCE(?, nombre),
        descripcion = COALESCE(?, descripcion),
        marca = COALESCE(?, marca),
        precio_base = COALESCE(?, precio_base),
        imagen_url = COALESCE(?, imagen_url),
        mercadolibre_url = COALESCE(?, mercadolibre_url),
        activo = COALESCE(?, activo)
       WHERE id = ?`,
      [nombre, descripcion, marca, precio_base, imagen_url,
       mercadolibre_url, activo, req.params.id]
    );

    res.json({ message: "Producto actualizado." });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/productos/:id  (solo admin - baja lógica)
async function eliminar(req, res, next) {
  try {
    await pool.query("UPDATE productos SET activo = 0 WHERE id = ?", [req.params.id]);
    res.json({ message: "Producto desactivado." });
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, detalle, crear, actualizar, eliminar };
