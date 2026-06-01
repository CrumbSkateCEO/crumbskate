import pool from '../config/db';
import { Request, Response, NextFunction } from 'express';

// GET /api/resenas (listar todas para admin)
export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    const [resenas] = await pool.query(`
      SELECT r.*, p.nombre as producto, u.nombre as usuario
      FROM resenas r
      JOIN productos p ON r.producto_id = p.id
      JOIN usuarios u ON r.usuario_id = u.id
      ORDER BY r.created_at DESC
    `);
    res.json(resenas);
  } catch (err) {
    next(err);
  }
}

// PUT /api/resenas/:id/estado (aprobar/ocultar)
export async function cambiarEstado(req: Request, res: Response, next: NextFunction) {
  try {
    const { aprobado } = req.body;
    await pool.query('UPDATE resenas SET aprobado = ? WHERE id = ?', [aprobado, req.params.id]);
    res.json({ message: 'Estado de reseña actualizado' });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/resenas/:id
export async function eliminar(req: Request, res: Response, next: NextFunction) {
  try {
    await pool.query('DELETE FROM resenas WHERE id = ?', [req.params.id]);
    res.json({ message: 'Reseña eliminada' });
  } catch (err) {
    next(err);
  }
}
