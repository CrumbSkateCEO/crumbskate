"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const validarRegistro = [
    (0, express_validator_1.body)('nombre').trim().notEmpty().withMessage('El nombre es requerido.'),
    (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Email inválido.'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres.')
        .matches(/\d/)
        .withMessage('La contraseña debe incluir al menos un número.'),
];
const validarLogin = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').notEmpty(),
];
router.post('/registro', validarRegistro, auth_controller_1.registro);
router.post('/login', validarLogin, auth_controller_1.login);
router.get('/perfil', auth_1.verificarToken, auth_controller_1.perfil);
exports.default = router;
