import pool from '../config/db';
import { Request, Response, NextFunction } from 'express';

// GET /api/configuracion
export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    const [configs] = await pool.query('SELECT clave, valor FROM configuracion');
    // Transform array to key-value object
    const configObj = (configs as any[]).reduce((acc, curr) => {
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
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const configData = req.body;
    
    for (const clave of Object.keys(configData)) {
      const valor = configData[clave];
      await conn.query(
        'INSERT INTO configuracion (clave, valor) VALUES (?, ?) ON DUPLICATE KEY UPDATE valor = ?',
        [clave, valor, valor]
      );
    }
    
    await conn.commit();
    res.json({ message: 'Configuración actualizada' });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
}
