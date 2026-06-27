import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/db';
import { sendMail } from '../utils/mail';
import { newsletterWelcomeEmail } from '../utils/emailTemplates';

// POST /api/newsletter/suscribir
export async function suscribir(req: Request, res: Response, next: NextFunction) {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ success: false, error: 'Email inválido.' });
    }

    const { email } = req.body;

    const existente = await prisma.newsletterSuscriptor.findUnique({ where: { email } });

    if (existente) {
      if (!existente.activo) {
        await prisma.newsletterSuscriptor.update({
          where: { email },
          data: { activo: true },
        });
      }
      return res.json({ success: true, message: '¡Ya estás suscrito al newsletter!' });
    }

    await prisma.newsletterSuscriptor.create({ data: { email } });

    const { subject, html } = newsletterWelcomeEmail();
    try {
      await sendMail(email, subject, html);
    } catch (mailErr) {
      console.error('[newsletter] Error enviando email de bienvenida:', mailErr);
    }

    res.status(201).json({ success: true, message: '¡Suscripción confirmada!' });
  } catch (err) {
    next(err);
  }
}
