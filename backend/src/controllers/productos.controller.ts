import prisma from '../config/db';
import { Prisma } from '@prisma/client';
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// GET /api/productos
export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    const { categoria_id, marca, genero, buscar, pagina = 1, limite = 12 } = req.query;
    const take = parseInt(limite as string);
    const skip = (parseInt(pagina as string) - 1) * take;

    const where: Prisma.ProductoWhereInput = {
      activo: true,
      ...(categoria_id && { categoria_id: parseInt(categoria_id as string) }),
      ...(marca && { marca: marca as string }),
      ...(genero && { genero: genero as Prisma.EnumGeneroProductoFilter['equals'] }),
      ...(buscar && {
        OR: [
          { nombre: { contains: buscar as string, mode: 'insensitive' } },
          { descripcion: { contains: buscar as string, mode: 'insensitive' } },
        ],
      }),
    };

    const productos = await prisma.producto.findMany({
      where,
      orderBy: { id: 'desc' },
      take,
      skip,
      include: {
        categoria: { select: { nombre: true } },
        variantes: {
          select: { id: true, talla: true, color: true, stock: true, precio_extra: true },
        },
      },
    });

    const resultado = productos.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      marca: p.marca,
      codigo_sku: p.codigo_sku,
      precio_base: p.precio_base,
      imagen_url: p.imagen_url,
      mercadolibre_url: p.mercadolibre_url,
      genero: p.genero,
      categoria: p.categoria?.nombre,
      variantes: p.variantes,
    }));

    res.json(resultado);
  } catch (err) {
    next(err);
  }
}

// GET /api/productos/:id
export async function detalle(req: Request, res: Response, next: NextFunction) {
  try {
    const producto = await prisma.producto.findFirst({
      where: { id: parseInt(req.params.id), activo: true },
      include: {
        categoria: { select: { nombre: true } },
        variantes: {
          select: { id: true, talla: true, color: true, stock: true, precio_extra: true },
        },
      },
    });

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    res.json({
      ...producto,
      categoria: producto.categoria?.nombre,
      variantes: producto.variantes,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/productos  (solo admin)
export async function crear(req: Request, res: Response, next: NextFunction) {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { categoria_id, nombre, descripcion, marca, codigo_sku,
            precio_base, mercadolibre_url, genero = 'unisex' } = req.body;

    const imagen_url = req.file ? `/${req.file.filename}` : req.body.imagen_url;

    let variantes: { talla?: string; stock?: number }[] = [];
    if (req.body.variantes) {
      try {
        variantes = JSON.parse(req.body.variantes);
      } catch (e) {}
    }
    if (variantes.length === 0) {
      variantes = [{ talla: 'Único', stock: 10 }];
    }

    const producto = await prisma.producto.create({
      data: {
        categoria_id: parseInt(categoria_id),
        nombre,
        descripcion,
        marca,
        codigo_sku,
        precio_base,
        imagen_url: imagen_url || null,
        mercadolibre_url: mercadolibre_url || null,
        genero,
        variantes: {
          create: variantes.map((v) => ({
            talla: v.talla || 'Único',
            color: 'Único',
            stock: v.stock || 0,
            precio_extra: 0,
          })),
        },
      },
      select: { id: true },
    });

    res.status(201).json({ message: 'Producto creado.', id: producto.id });
  } catch (err) {
    next(err);
  }
}

// PUT /api/productos/:id  (solo admin)
export async function actualizar(req: Request, res: Response, next: NextFunction) {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { nombre, descripcion, marca, precio_base, mercadolibre_url, activo, genero } = req.body;
    const id = parseInt(req.params.id);

    let imagen_url = req.body.imagen_url;
    if (req.file) {
      imagen_url = `/${req.file.filename}`;
    }

    const data: Prisma.ProductoUpdateInput = {};
    if (nombre !== undefined) data.nombre = nombre;
    if (descripcion !== undefined) data.descripcion = descripcion;
    if (marca !== undefined) data.marca = marca;
    if (precio_base !== undefined) data.precio_base = precio_base;
    if (imagen_url !== undefined) data.imagen_url = imagen_url;
    if (mercadolibre_url !== undefined) data.mercadolibre_url = mercadolibre_url;
    if (activo !== undefined) data.activo = activo;
    if (genero !== undefined) data.genero = genero;

    await prisma.$transaction(async (tx) => {
      await tx.producto.update({ where: { id }, data });

      if (req.body.variantes) {
        try {
          const variantes = JSON.parse(req.body.variantes);
          if (variantes.length > 0) {
            await tx.variante.deleteMany({ where: { producto_id: id } });
            await tx.variante.createMany({
              data: variantes.map((v: { talla?: string; stock?: number }) => ({
                producto_id: id,
                talla: v.talla || 'Único',
                color: 'Único',
                stock: v.stock || 0,
                precio_extra: 0,
              })),
            });
          }
        } catch (e) {
          console.error('Error parsing variantes in update', e);
        }
      }
    });

    res.json({ message: 'Producto actualizado.' });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/productos/:id  (solo admin - baja lógica)
export async function eliminar(req: Request, res: Response, next: NextFunction) {
  try {
    await prisma.producto.update({
      where: { id: parseInt(req.params.id) },
      data: { activo: false },
    });
    res.json({ message: 'Producto desactivado.' });
  } catch (err) {
    next(err);
  }
}
