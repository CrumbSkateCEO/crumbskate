import prisma from '../config/db';
import { Request, Response, NextFunction } from 'express';

async function obtenerOCrearCarrito(usuarioId: number): Promise<number> {
  const existente = await prisma.carrito.findUnique({
    where: { usuario_id: usuarioId },
    select: { id: true },
  });

  if (existente) return existente.id;

  const carrito = await prisma.carrito.create({
    data: { usuario_id: usuarioId },
    select: { id: true },
  });
  return carrito.id;
}

// GET /api/carrito
export async function ver(req: Request, res: Response, next: NextFunction) {
  try {
    const carritoId = await obtenerOCrearCarrito(req.usuario?.id as number);

    const items = await prisma.carritoItem.findMany({
      where: { carrito_id: carritoId },
      include: {
        variante: {
          include: {
            producto: { select: { nombre: true, precio_base: true, imagen_url: true } },
          },
        },
      },
    });

    const resultado = items.map((ci) => {
      const precioBase = Number(ci.variante.producto.precio_base);
      const precioExtra = Number(ci.variante.precio_extra);
      const subtotal = (precioBase + precioExtra) * ci.cantidad;
      return {
        id: ci.id,
        cantidad: ci.cantidad,
        talla: ci.variante.talla,
        color: ci.variante.color,
        precio_extra: ci.variante.precio_extra,
        nombre: ci.variante.producto.nombre,
        precio_base: ci.variante.producto.precio_base,
        imagen_url: ci.variante.producto.imagen_url,
        subtotal: subtotal.toFixed(2),
      };
    });

    const total = resultado.reduce((acc, i) => acc + parseFloat(i.subtotal), 0);
    res.json({ carritoId, items: resultado, total: total.toFixed(2) });
  } catch (err) {
    next(err);
  }
}

// POST /api/carrito/agregar
export async function agregar(req: Request, res: Response, next: NextFunction) {
  try {
    const { variante_id, cantidad = 1 } = req.body;
    if (!variante_id) return res.status(400).json({ error: 'variante_id requerido.' });

    const variante = await prisma.variante.findUnique({
      where: { id: variante_id },
      select: { stock: true },
    });

    if (!variante) {
      return res.status(404).json({ error: 'Variante no encontrada.' });
    }
    if (variante.stock < cantidad) {
      return res.status(400).json({ error: 'Stock insuficiente.' });
    }

    const carritoId = await obtenerOCrearCarrito(req.usuario?.id as number);

    const existente = await prisma.carritoItem.findFirst({
      where: { carrito_id: carritoId, variante_id },
    });

    if (existente) {
      await prisma.carritoItem.update({
        where: { id: existente.id },
        data: { cantidad: { increment: cantidad } },
      });
    } else {
      await prisma.carritoItem.create({
        data: { carrito_id: carritoId, variante_id, cantidad },
      });
    }

    res.json({ message: 'Producto agregado al carrito.' });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/carrito/item/:itemId
export async function eliminarItem(req: Request, res: Response, next: NextFunction) {
  try {
    const carritoId = await obtenerOCrearCarrito(req.usuario?.id as number);
    await prisma.carritoItem.deleteMany({
      where: { id: parseInt(req.params.itemId), carrito_id: carritoId },
    });
    res.json({ message: 'Item eliminado del carrito.' });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/carrito/vaciar
export async function vaciar(req: Request, res: Response, next: NextFunction) {
  try {
    const carritoId = await obtenerOCrearCarrito(req.usuario?.id as number);
    await prisma.carritoItem.deleteMany({ where: { carrito_id: carritoId } });
    res.json({ message: 'Carrito vaciado.' });
  } catch (err) {
    next(err);
  }
}
