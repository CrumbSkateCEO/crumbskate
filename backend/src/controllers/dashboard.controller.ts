import prisma from '../config/db';
import { Request, Response, NextFunction } from 'express';

const STOCK_BAJO = 5;

// GET /api/dashboard/stats  (solo admin)
export async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    const [ventasAgg, pedidosCount, pedidosRecientes] = await Promise.all([
      prisma.pedido.aggregate({
        where: { estado: { not: 'cancelado' } },
        _sum: { total: true },
      }),
      prisma.pedido.count({ where: { estado: { not: 'cancelado' } } }),
      prisma.pedido.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          total: true,
          estado: true,
          created_at: true,
          usuario: { select: { nombre: true } },
        },
      }),
    ]);

    const totalVentas = Number(ventasAgg._sum.total || 0);
    const totalPedidos = pedidosCount;
    const ticketPromedio = totalPedidos > 0 ? totalVentas / totalPedidos : 0;

    res.json({
      totalVentas,
      totalPedidos,
      ticketPromedio,
      pedidosRecientes: pedidosRecientes.map((p) => ({
        id: p.id,
        total: p.total,
        estado: p.estado,
        created_at: p.created_at,
        cliente: p.usuario.nombre,
      })),
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/dashboard/notificaciones  (solo admin)
export async function getNotificaciones(req: Request, res: Response, next: NextFunction) {
  try {
    const [pedidosPendientes, stockBajo, resenasPendientes] = await Promise.all([
      prisma.pedido.findMany({
        where: { estado: 'pendiente' },
        orderBy: { created_at: 'desc' },
        take: 10,
        select: {
          id: true,
          total: true,
          created_at: true,
          usuario: { select: { nombre: true } },
        },
      }),
      prisma.variante.findMany({
        where: { stock: { lte: STOCK_BAJO }, producto: { activo: true } },
        take: 10,
        select: {
          id: true,
          stock: true,
          talla: true,
          color: true,
          producto: { select: { nombre: true } },
        },
      }),
      prisma.resena.findMany({
        where: { aprobado: false },
        orderBy: { created_at: 'desc' },
        take: 10,
        select: {
          id: true,
          created_at: true,
          producto: { select: { nombre: true } },
          usuario: { select: { nombre: true } },
        },
      }),
    ]);

    const notificaciones = [
      ...pedidosPendientes.map((p) => ({
        id: `pedido-${p.id}`,
        tipo: 'pedido' as const,
        mensaje: `Pedido #${p.id} pendiente — ${p.usuario.nombre}`,
        link: '/admin/pedidos',
        created_at: p.created_at,
      })),
      ...stockBajo.map((v) => ({
        id: `stock-${v.id}`,
        tipo: 'stock' as const,
        mensaje: `Stock bajo: ${v.producto.nombre}${v.talla ? ` (${v.talla})` : ''} — ${v.stock} u.`,
        link: '/admin/stock',
        created_at: new Date(),
      })),
      ...resenasPendientes.map((r) => ({
        id: `resena-${r.id}`,
        tipo: 'resena' as const,
        mensaje: `Reseña pendiente de ${r.usuario.nombre} en ${r.producto.nombre}`,
        link: '/admin/resenas',
        created_at: r.created_at,
      })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json({ notificaciones, total: notificaciones.length });
  } catch (err) {
    next(err);
  }
}
