import pool from '../config/db';
import { Request, Response, NextFunction } from 'express';

// GET /api/categorias
export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    const [categorias] = await pool.query(
      'SELECT id, nombre, descripcion FROM categorias ORDER BY nombre'
    );
    res.json(categorias);
  } catch (err) {
    next(err);
  }
}

// POST /api/categorias  (solo admin)
export async function crear(req: Request, res: Response, next: NextFunction) {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es requerido.' });

    const [result]: any = await pool.query(
      'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
      [nombre, descripcion || null]
    );
    res.status(201).json({ message: 'Categoría creada.', id: result.insertId });
  } catch (err) {
    next(err);
  }
}

// PUT /api/categorias/:id
export async function actualizar(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es requerido.' });

    await pool.query(
      'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?',
      [nombre, descripcion || null, id]
    );
    res.json({ message: 'Categoría actualizada.' });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/categorias/:id
export async function eliminar(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM categorias WHERE id = ?', [id]);
    res.json({ message: 'Categoría eliminada.' });
  } catch (err) {
    // Si la categoría tiene productos asignados fallará por la llave foránea, 
    // se le puede enviar un error más amigable.
    if ((err as any).code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ error: 'No se puede eliminar la categoría porque hay productos asignados a ella.' });
    }
    next(err);
  }
}
