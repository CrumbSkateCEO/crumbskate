import prisma from '../config/db';
import { Request, Response, NextFunction } from 'express';

// GET /api/reportes/ventas-por-dia
export async function ventasPorDia(req: Request, res: Response, next: NextFunction) {
  try {
    const rows = await prisma.$queryRaw<
      { fecha: Date; total_ventas: number; cantidad_pedidos: bigint }[]
    >`
      SELECT DATE(created_at) as fecha,
             SUM(total) as total_ventas,
             COUNT(id) as cantidad_pedidos
      FROM pedidos
      WHERE estado != 'cancelado'
      GROUP BY DATE(created_at)
      ORDER BY fecha DESC
      LIMIT 30
    `;

    res.json(
      rows.map((r) => ({
        fecha: r.fecha,
        total_ventas: r.total_ventas,
        cantidad_pedidos: Number(r.cantidad_pedidos),
      }))
    );
  } catch (err) {
    next(err);
  }
}

// GET /api/reportes/productos-mas-vendidos
export async function productosMasVendidos(req: Request, res: Response, next: NextFunction) {
  try {
    const rows = await prisma.$queryRaw<
      {
        id: number;
        nombre: string;
        imagen_url: string | null;
        total_vendidos: bigint;
        ingresos_generados: number;
      }[]
    >`
      SELECT p.id, p.nombre, p.imagen_url,
             SUM(pi.cantidad) as total_vendidos,
             SUM(pi.cantidad * pi.precio_unitario) as ingresos_generados
      FROM pedido_items pi
      JOIN variantes v ON pi.variante_id = v.id
      JOIN productos p ON v.producto_id = p.id
      JOIN pedidos ped ON pi.pedido_id = ped.id
      WHERE ped.estado != 'cancelado'
      GROUP BY p.id, p.nombre, p.imagen_url
      ORDER BY total_vendidos DESC
      LIMIT 10
    `;

    res.json(
      rows.map((r) => ({
        ...r,
        total_vendidos: Number(r.total_vendidos),
      }))
    );
  } catch (err) {
    next(err);
  }
}
