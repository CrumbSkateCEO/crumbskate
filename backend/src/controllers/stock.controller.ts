import prisma from '../config/db';
import { Request, Response, NextFunction } from 'express';

// GET /api/stock
export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    const variantes = await prisma.variante.findMany({
      where: { producto: { activo: true } },
      orderBy: [{ producto: { nombre: 'asc' } }, { talla: 'asc' }],
      include: {
        producto: { select: { nombre: true, imagen_url: true } },
      },
    });

    res.json(
      variantes.map((v) => ({
        id: v.id,
        producto: v.producto.nombre,
        imagen_url: v.producto.imagen_url,
        talla: v.talla,
        color: v.color,
        stock: v.stock,
        precio_extra: v.precio_extra,
      }))
    );
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
    await prisma.variante.update({
      where: { id: parseInt(req.params.id) },
      data: { stock },
    });
    res.json({ message: 'Stock actualizado' });
  } catch (err) {
    next(err);
  }
}
