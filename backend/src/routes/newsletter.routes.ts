import { Router } from 'express';
import { body } from 'express-validator';
import { suscribir } from '../controllers/newsletter.controller';

const router = Router();

router.post(
  '/suscribir',
  [body('email').isEmail().normalizeEmail().withMessage('Email inválido.')],
  suscribir
);

export default router;
