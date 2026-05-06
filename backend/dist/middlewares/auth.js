"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarToken = verificarToken;
exports.soloAdmin = soloAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Verifica que el token JWT sea válido
function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer <token>"
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token requerido.' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // { id, email, rol }
        next();
    }
    catch (err) {
        return res.status(403).json({ error: 'Token inválido o expirado.' });
    }
}
// Solo permite acceso a admins
function soloAdmin(req, res, next) {
    if (!req.usuario || req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso restringido a administradores.' });
    }
    next();
}
