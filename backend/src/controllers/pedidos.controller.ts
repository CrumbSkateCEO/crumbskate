import prisma from '../config/db';
import { Request, Response, NextFunction } from 'express';

// POST /api/pedidos  - crea un pedido desde el carrito
export async function crear(req: Request, res: Response, next: NextFunction) {
  try {
    const resultado = await prisma.$transaction(async (tx) => {
      const carrito = await tx.carrito.findFirst({
        where: { usuario_id: req.usuario?.id },
      });

      if (!carrito) {
        throw Object.assign(new Error('No tenés un carrito activo.'), { statusCode: 400 });
      }

      const items = await tx.carritoItem.findMany({
        where: { carrito_id: carrito.id },
        include: {
          variante: { include: { producto: { select: { precio_base: true } } } },
        },
      });

      if (items.length === 0) {
        throw Object.assign(new Error('El carrito está vacío.'), { statusCode: 400 });
      }

      for (const item of items) {
        if (item.variante.stock < item.cantidad) {
          throw Object.assign(new Error('Stock insuficiente para uno o más productos.'), { statusCode: 400 });
        }
      }

      const total = items.reduce((acc, item) => {
        const precio = Number(item.variante.producto.precio_base) + Number(item.variante.precio_extra);
        return acc + precio * item.cantidad;
      }, 0);

      const pedido = await tx.pedido.create({
        data: {
          usuario_id: req.usuario!.id,
          total,
          estado: 'pendiente',
        },
      });

      for (const item of items) {
        const precioUnitario = Number(item.variante.producto.precio_base) + Number(item.variante.precio_extra);
        await tx.pedidoItem.create({
          data: {
            pedido_id: pedido.id,
            variante_id: item.variante_id,
            cantidad: item.cantidad,
            precio_unitario: precioUnitario,
          },
        });
        await tx.variante.update({
          where: { id: item.variante_id },
          data: { stock: { decrement: item.cantidad } },
        });
      }

      await tx.pago.create({
        data: { pedido_id: pedido.id, estado: 'pendiente', monto: total },
      });

      await tx.carritoItem.deleteMany({ where: { carrito_id: carrito.id } });

      return { pedidoId: pedido.id, total };
    });

    res.status(201).json({
      message: 'Pedido creado.',
      pedidoId: resultado.pedidoId,
      total: Number(resultado.total).toFixed(2),
    });
  } catch (err: any) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    next(err);
  }
}

// GET /api/pedidos  - historial del usuario
export async function historial(req: Request, res: Response, next: NextFunction) {
  try {
    const pedidos = await prisma.pedido.findMany({
      where: { usuario_id: req.usuario?.id },
      orderBy: { created_at: 'desc' },
      include: { _count: { select: { items: true } } },
    });

    res.json(
      pedidos.map((p) => ({
        id: p.id,
        estado: p.estado,
        total: p.total,
        ml_order_id: p.ml_order_id,
        created_at: p.created_at,
        cantidad_items: p._count.items,
      }))
    );
  } catch (err) {
    next(err);
  }
}

// GET /api/pedidos/:id  - detalle de un pedido
export async function detalle(req: Request, res: Response, next: NextFunction) {
  try {
    const pedido = await prisma.pedido.findFirst({
      where: { id: parseInt(req.params.id), usuario_id: req.usuario?.id },
      include: {
        items: {
          include: {
            variante: {
              include: { producto: { select: { nombre: true } } },
            },
          },
        },
      },
    });

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }

    const items = pedido.items.map((pi) => ({
      cantidad: pi.cantidad,
      precio_unitario: pi.precio_unitario,
      nombre: pi.variante?.producto.nombre,
      talla: pi.variante?.talla,
      color: pi.variante?.color,
    }));

    const { items: _, ...pedidoData } = pedido;
    res.json({ ...pedidoData, items });
  } catch (err) {
    next(err);
  }
}

// GET /api/pedidos/todos  - todos los pedidos (solo admin)
export async function todos(req: Request, res: Response, next: NextFunction) {
  try {
    const pedidos = await prisma.pedido.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        usuario: { select: { nombre: true, email: true } },
      },
    });

    res.json(
      pedidos.map((p) => ({
        id: p.id,
        estado: p.estado,
        total: p.total,
        created_at: p.created_at,
        cliente: p.usuario.nombre,
        email: p.usuario.email,
      }))
    );
  } catch (err) {
    next(err);
  }
}

// PUT /api/pedidos/:id/cancelar
export async function cancelar(req: Request, res: Response, next: NextFunction) {
  try {
    await prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.findFirst({
        where: { id: parseInt(req.params.id), usuario_id: req.usuario?.id },
      });

      if (!pedido) {
        throw Object.assign(new Error('Pedido no encontrado.'), { statusCode: 404 });
      }

      if (pedido.estado !== 'pendiente') {
        throw Object.assign(new Error('Solo se pueden cancelar pedidos pendientes.'), { statusCode: 400 });
      }

      await tx.pedido.update({
        where: { id: pedido.id },
        data: { estado: 'cancelado' },
      });

      const items = await tx.pedidoItem.findMany({
        where: { pedido_id: pedido.id },
        select: { variante_id: true, cantidad: true },
      });

      for (const item of items) {
        if (item.variante_id) {
          await tx.variante.update({
            where: { id: item.variante_id },
            data: { stock: { increment: item.cantidad } },
          });
        }
      }
    });

    res.json({ message: 'Pedido cancelado exitosamente.' });
  } catch (err: any) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    next(err);
  }
}
