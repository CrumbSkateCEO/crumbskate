import pool from '../config/db';
import { Request, Response, NextFunction } from 'express';

// GET /api/dashboard/stats  (solo admin)
export async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Total Ventas (suma de totales de pedidos no cancelados)
    const [salesRow]: any = await pool.query(
      `SELECT SUM(total) as total_ventas FROM pedidos WHERE estado != 'cancelado'`
    );
    const totalVentas = salesRow[0]?.total_ventas || 0;

    // 2. Pedidos Totales
    const [ordersRow]: any = await pool.query(
      `SELECT COUNT(*) as total_pedidos FROM pedidos WHERE estado != 'cancelado'`
    );
    const totalPedidos = ordersRow[0]?.total_pedidos || 0;

    // 3. Ticket Promedio
    const ticketPromedio = totalPedidos > 0 ? (totalVentas / totalPedidos) : 0;

    // 4. Pedidos Recientes
    const [pedidosRecientes]: any = await pool.query(
      `SELECT p.id, p.total, p.estado, p.created_at, u.nombre as cliente
       FROM pedidos p
       JOIN usuarios u ON p.usuario_id = u.id
       ORDER BY p.created_at DESC LIMIT 5`
    );

    res.json({
      totalVentas,
      totalPedidos,
      ticketPromedio,
      pedidosRecientes
    });
  } catch (err) {
    next(err);
  }
}
