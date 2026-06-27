import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../config/db';
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { sendMail } from '../utils/mail';
import { resetPasswordEmail } from '../utils/emailTemplates';

type UsuarioAuth = {
  id: number;
  nombre: string;
  email: string;
  rol: string;
};

function crearTokenRespuesta(usuario: UsuarioAuth) {
  const expiresIn: SignOptions['expiresIn'] = (process.env.JWT_EXPIRES_IN || '24h') as SignOptions['expiresIn'];
  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET as string,
    { expiresIn }
  );

  return {
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    },
  };
}

function frontendBaseUrl(): string {
  const url = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',')[0].trim();
  return url.replace(/\/$/, '');
}

// POST /api/auth/registro
export async function registro(req: Request, res: Response, next: NextFunction) {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { nombre, email, password, telefono } = req.body;

    const existente = await prisma.usuario.findUnique({ where: { email } });
    if (existente) {
      return res.status(409).json({ error: 'El email ya está registrado.' });
    }

    const hash = await bcrypt.hash(password, 10);

    const usuario = await prisma.usuario.create({
      data: { nombre, email, password_hash: hash, telefono: telefono || null },
      select: { id: true, nombre: true, email: true, rol: true },
    });

    res.status(201).json({
      message: 'Usuario registrado correctamente.',
      ...crearTokenRespuesta(usuario),
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { email, password } = req.body;

    const usuario = await prisma.usuario.findUnique({
      where: { email },
      select: { id: true, nombre: true, email: true, password_hash: true, rol: true },
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    res.json(crearTokenRespuesta(usuario));
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/perfil  (requiere token)
export async function perfil(req: Request, res: Response, next: NextFunction) {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario?.id },
      select: { id: true, nombre: true, email: true, telefono: true, rol: true, created_at: true },
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.json(usuario);
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/reset-password
export async function solicitarResetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ success: false, error: 'Email inválido.' });
    }

    const { email } = req.body;
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    // Respuesta genérica por seguridad (no revelar si el email existe)
    const respuestaOk = { success: true, message: 'Si el email existe, recibirás un enlace de recuperación.' };

    if (!usuario) {
      return res.json(respuestaOk);
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { reset_token: token, reset_token_expires: expires },
    });

    const resetUrl = `${frontendBaseUrl()}/nueva-contrasena/${token}`;
    const { subject, html } = resetPasswordEmail(usuario.nombre, resetUrl);

    try {
      await sendMail(usuario.email, subject, html);
    } catch (mailErr) {
      console.error('[reset-password] Error enviando email:', mailErr);
      return res.status(503).json({
        success: false,
        error: 'No se pudo enviar el email. Intentá más tarde.',
      });
    }

    res.json(respuestaOk);
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/reset-password/confirm
export async function confirmarResetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ success: false, errores: errores.array() });
    }

    const { token, password } = req.body;

    const usuario = await prisma.usuario.findFirst({
      where: {
        reset_token: token,
        reset_token_expires: { gt: new Date() },
      },
    });

    if (!usuario) {
      return res.status(400).json({ success: false, error: 'El enlace es inválido o expiró.' });
    }

    const hash = await bcrypt.hash(password, 10);

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        password_hash: hash,
        reset_token: null,
        reset_token_expires: null,
      },
    });

    res.json({ success: true, message: 'Contraseña actualizada correctamente.' });
  } catch (err) {
    next(err);
  }
}
