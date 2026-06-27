"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registro = registro;
exports.login = login;
exports.perfil = perfil;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const express_validator_1 = require("express-validator");
// POST /api/auth/registro
function registro(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const errores = (0, express_validator_1.validationResult)(req);
            if (!errores.isEmpty()) {
                return res.status(400).json({ errores: errores.array() });
            }
            const { nombre, email, password, telefono } = req.body;
            const existente = yield db_1.default.usuario.findUnique({ where: { email } });
            if (existente) {
                return res.status(409).json({ error: 'El email ya está registrado.' });
            }
            const hash = yield bcryptjs_1.default.hash(password, 10);
            const usuario = yield db_1.default.usuario.create({
                data: { nombre, email, password_hash: hash, telefono: telefono || null },
                select: { id: true },
            });
            res.status(201).json({
                message: 'Usuario registrado correctamente.',
                id: usuario.id,
            });
        }
        catch (err) {
            next(err);
        }
    });
}
// POST /api/auth/login
function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const errores = (0, express_validator_1.validationResult)(req);
            if (!errores.isEmpty()) {
                return res.status(400).json({ errores: errores.array() });
            }
            const { email, password } = req.body;
            const usuario = yield db_1.default.usuario.findUnique({
                where: { email },
                select: { id: true, nombre: true, email: true, password_hash: true, rol: true },
            });
            if (!usuario) {
                return res.status(401).json({ error: 'Credenciales inválidas.' });
            }
            const passwordValida = yield bcryptjs_1.default.compare(password, usuario.password_hash);
            if (!passwordValida) {
                return res.status(401).json({ error: 'Credenciales inválidas.' });
            }
            const expiresIn = (process.env.JWT_EXPIRES_IN || '24h');
            const token = jsonwebtoken_1.default.sign({ id: usuario.id, email: usuario.email, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn });
            res.json({
                token,
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    rol: usuario.rol,
                },
            });
        }
        catch (err) {
            next(err);
        }
    });
}
// GET /api/auth/perfil  (requiere token)
function perfil(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const usuario = yield db_1.default.usuario.findUnique({
                where: { id: (_a = req.usuario) === null || _a === void 0 ? void 0 : _a.id },
                select: { id: true, nombre: true, email: true, telefono: true, rol: true, created_at: true },
            });
            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado.' });
            }
            res.json(usuario);
        }
        catch (err) {
            next(err);
        }
    });
}
