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
