import { Router } from 'express';
import { body } from 'express-validator';
import {
  registro,
  login,
  perfil,
  solicitarResetPassword,
  confirmarResetPassword,
} from '../controllers/auth.controller';
import { verificarToken } from '../middlewares/auth';

const router = Router();

const validarRegistro = [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido.'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres.')
    .matches(/\d/)
    .withMessage('La contraseña debe incluir al menos un número.'),
];

const validarLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

const validarResetEmail = [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido.'),
];

const validarNuevaPassword = [
  body('token').notEmpty().withMessage('Token inválido.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres.')
    .matches(/\d/)
    .withMessage('La contraseña debe incluir al menos un número.'),
];

router.post('/registro', validarRegistro, registro);
router.post('/login', validarLogin, login);
router.get('/perfil', verificarToken, perfil);
router.post('/reset-password', validarResetEmail, solicitarResetPassword);
router.post('/reset-password/confirm', validarNuevaPassword, confirmarResetPassword);

export default router;
