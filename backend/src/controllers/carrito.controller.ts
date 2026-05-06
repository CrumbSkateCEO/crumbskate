import pool from '../config/db';
import { Request, Response, NextFunction } from 'express';

// Obtiene o crea el carrito activo del usuario
async function obtenerOCrearCarrito(usuarioId: number): Promise<number> {
  const [carritos]: any = await pool.query(
    'SELECT id FROM carrito WHERE usuario_id = ? LIMIT 1',
    [usuarioId]
  );

  if (carritos.length > 0) return carritos[0].id;

  const [result]: any = await pool.query(
    'INSERT INTO carrito (usuario_id) VALUES (?)',
    [usuarioId]
  );
  return result.insertId;
}

// GET /api/carrito
export async function ver(req: Request, res: Response, next: NextFunction) {
  try {
    const carritoId = await obtenerOCrearCarrito(req.usuario?.id as number);

    const [items]: any = await pool.query(
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

    const total = items.reduce((acc: number, i: any) => acc + parseFloat(i.subtotal), 0);
    res.json({ carritoId, items, total: total.toFixed(2) });
  } catch (err) {
    next(err);
  }
}

// POST /api/carrito/agregar
export async function agregar(req: Request, res: Response, next: NextFunction) {
  try {
    const { variante_id, cantidad = 1 } = req.body;
    if (!variante_id) return res.status(400).json({ error: 'variante_id requerido.' });

    // Verificar stock disponible
    const [variantes]: any = await pool.query(
      'SELECT stock FROM variantes WHERE id = ?',
      [variante_id]
    );
    if (variantes.length === 0) {
      return res.status(404).json({ error: 'Variante no encontrada.' });
    }
    if (variantes[0].stock < cantidad) {
      return res.status(400).json({ error: 'Stock insuficiente.' });
    }

    const carritoId = await obtenerOCrearCarrito(req.usuario?.id as number);

    // Si ya existe el item, incrementar cantidad
    const [existente]: any = await pool.query(
      'SELECT id, cantidad FROM carrito_items WHERE carrito_id = ? AND variante_id = ?',
      [carritoId, variante_id]
    );

    if (existente.length > 0) {
      await pool.query(
        'UPDATE carrito_items SET cantidad = cantidad + ? WHERE id = ?',
        [cantidad, existente[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO carrito_items (carrito_id, variante_id, cantidad) VALUES (?, ?, ?)',
        [carritoId, variante_id, cantidad]
      );
    }

    res.json({ message: 'Producto agregado al carrito.' });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/carrito/item/:itemId
export async function eliminarItem(req: Request, res: Response, next: NextFunction) {
  try {
    const carritoId = await obtenerOCrearCarrito(req.usuario?.id as number);
    await pool.query(
      'DELETE FROM carrito_items WHERE id = ? AND carrito_id = ?',
      [req.params.itemId, carritoId]
    );
    res.json({ message: 'Item eliminado del carrito.' });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/carrito/vaciar
export async function vaciar(req: Request, res: Response, next: NextFunction) {
  try {
    const carritoId = await obtenerOCrearCarrito(req.usuario?.id as number);
    await pool.query('DELETE FROM carrito_items WHERE carrito_id = ?', [carritoId]);
    res.json({ message: 'Carrito vaciado.' });
  } catch (err) {
    next(err);
  }
}
