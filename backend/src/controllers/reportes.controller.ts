import pool from '../config/db';
import { Request, Response, NextFunction } from 'express';

// GET /api/reportes/ventas-por-dia
export async function ventasPorDia(req: Request, res: Response, next: NextFunction) {
  try {
    const [ventas] = await pool.query(`
      SELECT DATE(created_at) as fecha, SUM(total) as total_ventas, COUNT(id) as cantidad_pedidos
      FROM pedidos
      WHERE estado != 'cancelado'
      GROUP BY DATE(created_at)
      ORDER BY fecha DESC
      LIMIT 30
    `);
    res.json(ventas);
  } catch (err) {
    next(err);
  }
}

// GET /api/reportes/productos-mas-vendidos
export async function productosMasVendidos(req: Request, res: Response, next: NextFunction) {
  try {
    const [productos] = await pool.query(`
      SELECT p.id, p.nombre, p.imagen_url, SUM(pi.cantidad) as total_vendidos, SUM(pi.cantidad * pi.precio_unitario) as ingresos_generados
      FROM pedido_items pi
      JOIN variantes v ON pi.variante_id = v.id
      JOIN productos p ON v.producto_id = p.id
      JOIN pedidos ped ON pi.pedido_id = ped.id
      WHERE ped.estado != 'cancelado'
      GROUP BY p.id
      ORDER BY total_vendidos DESC
      LIMIT 10
    `);
    res.json(productos);
  } catch (err) {
    next(err);
  }
}
