import pool from '../config/db';
import { Request, Response, NextFunction } from 'express';

// GET /api/cupones
export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    const [cupones] = await pool.query('SELECT * FROM cupones ORDER BY created_at DESC');
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

    const [result]: any = await pool.query(
      'INSERT INTO cupones (codigo, descuento_porcentaje, valido_hasta) VALUES (?, ?, ?)',
      [codigo.toUpperCase(), descuento_porcentaje, valido_hasta || null]
    );
    res.status(201).json({ message: 'Cupón creado', id: result.insertId });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El código ya existe.' });
    }
    next(err);
  }
}

// PUT /api/cupones/:id
export async function actualizar(req: Request, res: Response, next: NextFunction) {
  try {
    const { codigo, descuento_porcentaje, valido_hasta, activo } = req.body;
    
    await pool.query(
      `UPDATE cupones SET 
       codigo = COALESCE(?, codigo),
       descuento_porcentaje = COALESCE(?, descuento_porcentaje),
       valido_hasta = COALESCE(?, valido_hasta),
       activo = COALESCE(?, activo)
       WHERE id = ?`,
      [codigo?.toUpperCase(), descuento_porcentaje, valido_hasta, activo, req.params.id]
    );
    res.json({ message: 'Cupón actualizado' });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El código ya existe.' });
    }
    next(err);
  }
}

// DELETE /api/cupones/:id
export async function eliminar(req: Request, res: Response, next: NextFunction) {
  try {
    await pool.query('DELETE FROM cupones WHERE id = ?', [req.params.id]);
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

    const [cupones]: any = await pool.query(
      'SELECT descuento_porcentaje, valido_hasta, activo FROM cupones WHERE codigo = ?',
      [codigo.toUpperCase()]
    );

    if (cupones.length === 0) {
      return res.status(404).json({ error: 'Cupón inválido.' });
    }

    const cupon = cupones[0];

    if (cupon.activo === 0) {
      return res.status(400).json({ error: 'El cupón ya no está activo.' });
    }

    if (cupon.valido_hasta && new Date(cupon.valido_hasta) < new Date()) {
      return res.status(400).json({ error: 'El cupón ha expirado.' });
    }

    res.json({
      valido: true,
      descuento_porcentaje: cupon.descuento_porcentaje
    });
  } catch (err) {
    next(err);
  }
}
