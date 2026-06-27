import prisma from '../config/db';
import { Request, Response, NextFunction } from 'express';

// GET /api/resenas (listar todas para admin)
export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    const resenas = await prisma.resena.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        producto: { select: { nombre: true } },
        usuario: { select: { nombre: true } },
      },
    });

    res.json(
      resenas.map((r) => ({
        ...r,
        producto: r.producto.nombre,
        usuario: r.usuario.nombre,
      }))
    );
  } catch (err) {
    next(err);
  }
}

// PUT /api/resenas/:id/estado (aprobar/ocultar)
export async function cambiarEstado(req: Request, res: Response, next: NextFunction) {
  try {
    const { aprobado } = req.body;
    await prisma.resena.update({
      where: { id: parseInt(req.params.id) },
      data: { aprobado },
    });
    res.json({ message: 'Estado de reseña actualizado' });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/resenas/:id
export async function eliminar(req: Request, res: Response, next: NextFunction) {
  try {
    await prisma.resena.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Reseña eliminada' });
  } catch (err) {
    next(err);
  }
}
