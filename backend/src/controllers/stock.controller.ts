import pool from '../config/db';
import { Request, Response, NextFunction } from 'express';

// GET /api/stock
export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    const [stock] = await pool.query(`
      SELECT v.id, p.nombre as producto, p.imagen_url, v.talla, v.color, v.stock, v.precio_extra
      FROM variantes v
      JOIN productos p ON v.producto_id = p.id
      WHERE p.activo = 1
      ORDER BY p.nombre, v.talla
    `);
    res.json(stock);
  } catch (err) {
    next(err);
  }
}

// PUT /api/stock/:id
export async function actualizar(req: Request, res: Response, next: NextFunction) {
  try {
    const { stock } = req.body;
    if (stock === undefined || stock < 0) {
      return res.status(400).json({ error: 'Stock inválido' });
    }
    await pool.query('UPDATE variantes SET stock = ? WHERE id = ?', [stock, req.params.id]);
    res.json({ message: 'Stock actualizado' });
  } catch (err) {
    next(err);
  }
}
