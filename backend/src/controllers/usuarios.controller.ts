import pool from '../config/db';
import { Request, Response, NextFunction } from 'express';

// GET /api/usuarios/clientes
export async function listarClientes(req: Request, res: Response, next: NextFunction) {
  try {
    const [clientes] = await pool.query(`
      SELECT id, nombre, email, telefono, created_at, rol
      FROM usuarios
      WHERE rol != 'admin'
      ORDER BY created_at DESC
    `);
    res.json(clientes);
  } catch (err) {
    next(err);
  }
}

// GET /api/usuarios/admins
export async function listarAdmins(req: Request, res: Response, next: NextFunction) {
  try {
    const [admins] = await pool.query(`
      SELECT id, nombre, email, telefono, created_at, rol
      FROM usuarios
      WHERE rol = 'admin'
      ORDER BY created_at DESC
    `);
    res.json(admins);
  } catch (err) {
    next(err);
  }
}

// PUT /api/usuarios/:id/rol
export async function cambiarRol(req: Request, res: Response, next: NextFunction) {
  try {
    const { rol } = req.body;
    if (rol !== 'admin' && rol !== 'user' && rol !== 'cliente') {
      return res.status(400).json({ error: 'Rol inválido' });
    }
    
    // Evitar que el admin se quite el rol a sí mismo (opcional pero recomendado)
    if (req.params.id === String(req.usuario?.id)) {
      return res.status(400).json({ error: 'No puedes cambiar tu propio rol por seguridad.' });
    }

    await pool.query('UPDATE usuarios SET rol = ? WHERE id = ?', [rol, req.params.id]);
    res.json({ message: 'Rol actualizado' });
  } catch (err) {
    next(err);
  }
}
