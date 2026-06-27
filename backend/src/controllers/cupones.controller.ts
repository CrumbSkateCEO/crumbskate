import prisma from '../config/db';
import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

// GET /api/cupones
export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    const cupones = await prisma.cupon.findMany({ orderBy: { created_at: 'desc' } });
    res.json(cupones);
  } catch (err) {
    next(err);
  }
}

// POST /api/cupones
export async function crear(req: Request, res: Response, next: NextFunction) {
  try {
    const { codigo, descuento_porcentaje, valido_hasta } = req.body;

    if (!codigo || !descuento_porcentaje) {
      return res.status(400).json({ error: 'Código y descuento son requeridos.' });
    }

    const cupon = await prisma.cupon.create({
      data: {
        codigo: codigo.toUpperCase(),
        descuento_porcentaje,
        valido_hasta: valido_hasta ? new Date(valido_hasta) : null,
      },
      select: { id: true },
    });
    res.status(201).json({ message: 'Cupón creado', id: cupon.id });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return res.status(400).json({ error: 'El código ya existe.' });
    }
    next(err);
  }
}

// PUT /api/cupones/:id
export async function actualizar(req: Request, res: Response, next: NextFunction) {
  try {
    const { codigo, descuento_porcentaje, valido_hasta, activo } = req.body;
    const data: Prisma.CuponUpdateInput = {};

    if (codigo !== undefined) data.codigo = codigo.toUpperCase();
    if (descuento_porcentaje !== undefined) data.descuento_porcentaje = descuento_porcentaje;
    if (valido_hasta !== undefined) data.valido_hasta = valido_hasta ? new Date(valido_hasta) : null;
    if (activo !== undefined) data.activo = activo;

    await prisma.cupon.update({
      where: { id: parseInt(req.params.id) },
      data,
    });
    res.json({ message: 'Cupón actualizado' });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return res.status(400).json({ error: 'El código ya existe.' });
    }
    next(err);
  }
}

// DELETE /api/cupones/:id
export async function eliminar(req: Request, res: Response, next: NextFunction) {
  try {
    await prisma.cupon.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Cupón eliminado' });
  } catch (err) {
    next(err);
  }
}

// POST /api/cupones/validar
export async function validar(req: Request, res: Response, next: NextFunction) {
  try {
    const { codigo } = req.body;
    if (!codigo) {
      return res.status(400).json({ error: 'El código es requerido.' });
    }

    const cupon = await prisma.cupon.findUnique({
      where: { codigo: codigo.toUpperCase() },
      select: { descuento_porcentaje: true, valido_hasta: true, activo: true },
    });

    if (!cupon) {
      return res.status(404).json({ error: 'Cupón inválido.' });
    }

    if (!cupon.activo) {
      return res.status(400).json({ error: 'El cupón ya no está activo.' });
    }

    if (cupon.valido_hasta && cupon.valido_hasta < new Date()) {
      return res.status(400).json({ error: 'El cupón ha expirado.' });
    }

    res.json({
      valido: true,
      descuento_porcentaje: cupon.descuento_porcentaje,
    });
  } catch (err) {
    next(err);
  }
}
