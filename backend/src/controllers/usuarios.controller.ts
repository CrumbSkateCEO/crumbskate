import prisma from '../config/db';
import { esSuperAdmin } from '../config/superadmin';
import { RolUsuario } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

function mapUsuario(usuario: {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  created_at: Date;
  rol: RolUsuario;
}) {
  return {
    ...usuario,
    es_superadmin: esSuperAdmin(usuario.email),
  };
}

// GET /api/usuarios/clientes
export async function listarClientes(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarios = await prisma.usuario.findMany({
      where: { rol: { not: RolUsuario.admin } },
      orderBy: { created_at: 'desc' },
      select: { id: true, nombre: true, email: true, telefono: true, created_at: true, rol: true },
    });
    res.json(usuarios.map(mapUsuario));
  } catch (err) {
    next(err);
  }
}

// GET /api/usuarios/admins
export async function listarAdmins(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarios = await prisma.usuario.findMany({
      where: { rol: RolUsuario.admin },
      orderBy: { created_at: 'desc' },
      select: { id: true, nombre: true, email: true, telefono: true, created_at: true, rol: true },
    });
    res.json(usuarios.map(mapUsuario));
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

    if (req.params.id === String(req.usuario?.id)) {
      return res.status(400).json({ error: 'No puedes cambiar tu propio rol por seguridad.' });
    }

    const target = await prisma.usuario.findUnique({
      where: { id: parseInt(req.params.id) },
      select: { email: true },
    });

    if (!target) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (esSuperAdmin(target.email)) {
      return res.status(403).json({ error: 'No se puede modificar el rol del superadministrador.' });
    }

    const rolDb = rol === 'user' ? RolUsuario.cliente : (rol as RolUsuario);
    await prisma.usuario.update({
      where: { id: parseInt(req.params.id) },
      data: { rol: rolDb },
    });
    res.json({ message: 'Rol actualizado' });
  } catch (err) {
    next(err);
  }
}
