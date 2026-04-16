const { pool } = require("../config/db");

// Obtiene o crea el carrito activo del usuario
async function obtenerOCrearCarrito(usuarioId) {
  let [carritos] = await pool.query(
    "SELECT id FROM carrito WHERE usuario_id = ? LIMIT 1",
    [usuarioId]
  );

  if (carritos.length > 0) return carritos[0].id;

  const [result] = await pool.query(
    "INSERT INTO carrito (usuario_id) VALUES (?)",
    [usuarioId]
  );
  return result.insertId;
}

// GET /api/carrito
async function ver(req, res, next) {
  try {
    const carritoId = await obtenerOCrearCarrito(req.usuario.id);

    const [items] = await pool.query(
      `SELECT ci.id, ci.cantidad,
              v.talla, v.color, v.precio_extra,
              p.nombre, p.precio_base, p.imagen_url,
              (p.precio_base + v.precio_extra) * ci.cantidad AS subtotal
       FROM carrito_items ci
       JOIN variantes v ON ci.variante_id = v.id
       JOIN productos p ON v.producto_id = p.id
       WHERE ci.carrito_id = ?`,
      [carritoId]
    );

    const total = items.reduce((acc, i) => acc + parseFloat(i.subtotal), 0);
    res.json({ carritoId, items, total: total.toFixed(2) });
  } catch (err) {
    next(err);
  }
}

// POST /api/carrito/agregar
async function agregar(req, res, next) {
  try {
    const { variante_id, cantidad = 1 } = req.body;
    if (!variante_id) return res.status(400).json({ error: "variante_id requerido." });

    // Verificar stock disponible
    const [variantes] = await pool.query(
      "SELECT stock FROM variantes WHERE id = ?",
      [variante_id]
    );
    if (variantes.length === 0) {
      return res.status(404).json({ error: "Variante no encontrada." });
    }
    if (variantes[0].stock < cantidad) {
      return res.status(400).json({ error: "Stock insuficiente." });
    }

    const carritoId = await obtenerOCrearCarrito(req.usuario.id);

    // Si ya existe el item, incrementar cantidad
    const [existente] = await pool.query(
      "SELECT id, cantidad FROM carrito_items WHERE carrito_id = ? AND variante_id = ?",
      [carritoId, variante_id]
    );

    if (existente.length > 0) {
      await pool.query(
        "UPDATE carrito_items SET cantidad = cantidad + ? WHERE id = ?",
        [cantidad, existente[0].id]
      );
    } else {
      await pool.query(
        "INSERT INTO carrito_items (carrito_id, variante_id, cantidad) VALUES (?, ?, ?)",
        [carritoId, variante_id, cantidad]
      );
    }

    res.json({ message: "Producto agregado al carrito." });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/carrito/item/:itemId
async function eliminarItem(req, res, next) {
  try {
    const carritoId = await obtenerOCrearCarrito(req.usuario.id);
    await pool.query(
      "DELETE FROM carrito_items WHERE id = ? AND carrito_id = ?",
      [req.params.itemId, carritoId]
    );
    res.json({ message: "Item eliminado del carrito." });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/carrito/vaciar
async function vaciar(req, res, next) {
  try {
    const carritoId = await obtenerOCrearCarrito(req.usuario.id);
    await pool.query("DELETE FROM carrito_items WHERE carrito_id = ?", [carritoId]);
    res.json({ message: "Carrito vaciado." });
  } catch (err) {
    next(err);
  }
}

module.exports = { ver, agregar, eliminarItem, vaciar };
