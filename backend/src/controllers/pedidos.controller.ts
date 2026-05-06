import pool from '../config/db';
import { Request, Response, NextFunction } from 'express';

// POST /api/pedidos  - crea un pedido desde el carrito
export async function crear(req: Request, res: Response, next: NextFunction) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction(); // Todo o nada

    // Obtener carrito del usuario
    const [carritos]: any = await conn.query(
      'SELECT id FROM carrito WHERE usuario_id = ? LIMIT 1',
      [req.usuario?.id]
    );
    if (carritos.length === 0) {
      return res.status(400).json({ error: 'No tenés un carrito activo.' });
    }

    const carritoId = carritos[0].id;

    // Obtener items del carrito
    const [items]: any = await conn.query(
      `SELECT ci.variante_id, ci.cantidad,
              v.stock, v.precio_extra,
              p.precio_base
       FROM carrito_items ci
       JOIN variantes v ON ci.variante_id = v.id
       JOIN productos p ON v.producto_id = p.id
       WHERE ci.carrito_id = ?`,
      [carritoId]
    );

    if (items.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío.' });
    }

    // Verificar stock de cada item
    for (const item of items) {
      if (item.stock < item.cantidad) {
        await conn.rollback();
        return res.status(400).json({ error: 'Stock insuficiente para uno o más productos.' });
      }
    }

    // Calcular total
    const total = items.reduce(
      (acc: number, i: any) => acc + (parseFloat(i.precio_base) + parseFloat(i.precio_extra)) * i.cantidad,
      0
    );

    // Crear pedido
    const [pedido]: any = await conn.query(
      "INSERT INTO pedidos (usuario_id, total, estado) VALUES (?, ?, 'pendiente')",
      [req.usuario?.id, total.toFixed(2)]
    );
    const pedidoId = pedido.insertId;

    // Insertar items del pedido y descontar stock
    for (const item of items) {
      const precioUnitario = parseFloat(item.precio_base) + parseFloat(item.precio_extra);
      await conn.query(
        'INSERT INTO pedido_items (pedido_id, variante_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [pedidoId, item.variante_id, item.cantidad, precioUnitario]
      );
      await conn.query(
        'UPDATE variantes SET stock = stock - ? WHERE id = ?',
        [item.cantidad, item.variante_id]
      );
    }

    // Registrar pago pendiente
    await conn.query(
      "INSERT INTO pagos (pedido_id, estado, monto) VALUES (?, 'pendiente', ?)",
      [pedidoId, total.toFixed(2)]
    );

    // Vaciar carrito
    await conn.query('DELETE FROM carrito_items WHERE carrito_id = ?', [carritoId]);

    await conn.commit();
    res.status(201).json({ message: 'Pedido creado.', pedidoId, total: total.toFixed(2) });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
}

// GET /api/pedidos  - historial del usuario
export async function historial(req: Request, res: Response, next: NextFunction) {
  try {
    const [pedidos] = await pool.query(
      `SELECT p.id, p.estado, p.total, p.ml_order_id, p.created_at,
              COUNT(pi.id) AS cantidad_items
       FROM pedidos p
       LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
       WHERE p.usuario_id = ?
       GROUP BY p.id
       ORDER BY p.created_at DESC`,
      [req.usuario?.id]
    );
    res.json(pedidos);
  } catch (err) {
    next(err);
  }
}

// GET /api/pedidos/:id  - detalle de un pedido
export async function detalle(req: Request, res: Response, next: NextFunction) {
  try {
    const [pedidos]: any = await pool.query(
      'SELECT * FROM pedidos WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.usuario?.id]
    );
    if (pedidos.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }

    const [items] = await pool.query(
      `SELECT pi.cantidad, pi.precio_unitario,
              p.nombre, v.talla, v.color
       FROM pedido_items pi
       JOIN variantes v ON pi.variante_id = v.id
       JOIN productos p ON v.producto_id = p.id
       WHERE pi.pedido_id = ?`,
      [req.params.id]
    );

    res.json({ ...pedidos[0], items });
  } catch (err) {
    next(err);
  }
}
