import prisma from '../config/db';
import { Request, Response, NextFunction } from 'express';

// GET /api/configuracion
export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    const rows = await prisma.configuracion.findMany({
      select: { clave: true, valor: true },
    });
    const configObj = rows.reduce((acc: Record<string, string | null>, curr) => {
      acc[curr.clave] = curr.valor;
      return acc;
    }, {});
    res.json(configObj);
  } catch (err) {
    next(err);
  }
}

// PUT /api/configuracion
export async function actualizar(req: Request, res: Response, next: NextFunction) {
  try {
    const configData = req.body as Record<string, string>;

    await prisma.$transaction(
      Object.entries(configData).map(([clave, valor]) =>
        prisma.configuracion.upsert({
          where: { clave },
          create: { clave, valor },
          update: { valor },
        })
      )
    );

    res.json({ message: 'Configuración actualizada' });
  } catch (err) {
    next(err);
  }
}
