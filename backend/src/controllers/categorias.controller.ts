import prisma from '../config/db';
import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

// GET /api/categorias
export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nombre: 'asc' },
      select: { id: true, nombre: true, descripcion: true },
    });
    res.json(categorias);
  } catch (err) {
    next(err);
  }
}

// POST /api/categorias  (solo admin)
export async function crear(req: Request, res: Response, next: NextFunction) {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es requerido.' });

    const categoria = await prisma.categoria.create({
      data: { nombre, descripcion: descripcion || null },
      select: { id: true },
    });
    res.status(201).json({ message: 'Categoría creada.', id: categoria.id });
  } catch (err) {
    next(err);
  }
}

// PUT /api/categorias/:id
export async function actualizar(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es requerido.' });

    await prisma.categoria.update({
      where: { id: parseInt(id) },
      data: { nombre, descripcion: descripcion || null },
    });
    res.json({ message: 'Categoría actualizada.' });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/categorias/:id
export async function eliminar(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.categoria.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Categoría eliminada.' });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
      return res.status(400).json({
        error: 'No se puede eliminar la categoría porque hay productos asignados a ella.',
      });
    }
    next(err);
  }
}
