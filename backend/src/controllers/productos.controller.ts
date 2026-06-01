import pool from '../config/db';
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// GET /api/productos  - listar con filtros opcionales
export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    const { categoria_id, marca, genero, buscar, pagina = 1, limite = 12 } = req.query;
    const offset = (parseInt(pagina as string) - 1) * parseInt(limite as string);

    let query = `
      SELECT p.id, p.nombre, p.descripcion, p.marca, p.codigo_sku,
             p.precio_base, p.imagen_url, p.mercadolibre_url, p.genero,
             c.nombre AS categoria
      FROM productos p
      JOIN categorias c ON p.categoria_id = c.id
      WHERE p.activo = 1
    `;
    const params: any[] = [];

    if (categoria_id) {
      query += ' AND p.categoria_id = ?';
      params.push(categoria_id);
    }
    if (marca) {
      query += ' AND p.marca = ?';
      params.push(marca);
    }
    if (genero) {
      query += ' AND p.genero = ?';
      params.push(genero);
    }
    if (buscar) {
      query += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ?)';
      params.push(`%${buscar}%`, `%${buscar}%`);
    }

    query += ' ORDER BY p.id DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limite as string), offset);

    const [productos]: any = await pool.query(query, params);
    
    if (productos.length > 0) {
      const productIds = productos.map((p: any) => p.id);
      const [variantes]: any = await pool.query(
        'SELECT producto_id, id, talla, color, stock, precio_extra FROM variantes WHERE producto_id IN (?)',
        [productIds]
      );
      
      productos.forEach((p: any) => {
        p.variantes = variantes.filter((v: any) => v.producto_id === p.id);
      });
    }

    res.json(productos);
  } catch (err) {
    next(err);
  }
}

// GET /api/productos/:id  - detalle con variantes
export async function detalle(req: Request, res: Response, next: NextFunction) {
  try {
    const [productos]: any = await pool.query(
      `SELECT p.*, c.nombre AS categoria
       FROM productos p
       JOIN categorias c ON p.categoria_id = c.id
       WHERE p.id = ? AND p.activo = 1`,
      [req.params.id]
    );

    if (productos.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    const [variantes] = await pool.query(
      'SELECT id, talla, color, stock, precio_extra FROM variantes WHERE producto_id = ?',
      [req.params.id]
    );

    res.json({ ...productos[0], variantes });
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
            
    // Obtener la imagen subida si existe
    const imagen_url = req.file ? `/${req.file.filename}` : req.body.imagen_url;

    const [result]: any = await pool.query(
      `INSERT INTO productos
        (categoria_id, nombre, descripcion, marca, codigo_sku, precio_base, imagen_url, mercadolibre_url, genero)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [categoria_id, nombre, descripcion, marca, codigo_sku,
       precio_base, imagen_url || null, mercadolibre_url || null, genero]
    );

    const productId = result.insertId;

    let variantes = [];
    if (req.body.variantes) {
      try {
        variantes = JSON.parse(req.body.variantes);
      } catch (e) {}
    }
    
    if (variantes.length === 0) {
      variantes = [{ talla: 'Único', stock: 10 }];
    }

    for (const v of variantes) {
      await pool.query(
        `INSERT INTO variantes (producto_id, talla, color, stock, precio_extra)
         VALUES (?, ?, 'Único', ?, 0)`,
        [productId, v.talla || 'Único', v.stock || 0]
      );
    }

    res.status(201).json({ message: 'Producto creado.', id: productId });
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

    const { nombre, descripcion, marca, precio_base,
            mercadolibre_url, activo, genero } = req.body;
            
    // Si se sube un nuevo archivo, actualizar la ruta, si no, mantener la actual si viene en el body
    let imagen_url = req.body.imagen_url;
    if (req.file) {
      imagen_url = `/${req.file.filename}`;
    }

    await pool.query(
      `UPDATE productos SET
        nombre = COALESCE(?, nombre),
        descripcion = COALESCE(?, descripcion),
        marca = COALESCE(?, marca),
        precio_base = COALESCE(?, precio_base),
        imagen_url = COALESCE(?, imagen_url),
        mercadolibre_url = COALESCE(?, mercadolibre_url),
        activo = COALESCE(?, activo),
        genero = COALESCE(?, genero)
       WHERE id = ?`,
      [nombre, descripcion, marca, precio_base, imagen_url,
       mercadolibre_url, activo, genero, req.params.id]
    );

    if (req.body.variantes) {
      try {
        const variantes = JSON.parse(req.body.variantes);
        if (variantes.length > 0) {
          await pool.query('DELETE FROM variantes WHERE producto_id = ?', [req.params.id]);
          for (const v of variantes) {
            await pool.query(
              `INSERT INTO variantes (producto_id, talla, color, stock, precio_extra)
               VALUES (?, ?, 'Único', ?, 0)`,
              [req.params.id, v.talla || 'Único', v.stock || 0]
            );
          }
        }
      } catch (e) {
        console.error("Error parsing variantes in update", e);
      }
    }

    res.json({ message: 'Producto actualizado.' });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/productos/:id  (solo admin - baja lógica)
export async function eliminar(req: Request, res: Response, next: NextFunction) {
  try {
    await pool.query('UPDATE productos SET activo = 0 WHERE id = ?', [req.params.id]);
    res.json({ message: 'Producto desactivado.' });
  } catch (err) {
    next(err);
  }
}
