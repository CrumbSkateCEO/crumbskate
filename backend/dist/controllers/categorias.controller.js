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
exports.listar = listar;
exports.crear = crear;
const db_1 = __importDefault(require("../config/db"));
// GET /api/categorias
function listar(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [categorias] = yield db_1.default.query('SELECT id, nombre, descripcion FROM categorias ORDER BY nombre');
            res.json(categorias);
        }
        catch (err) {
            next(err);
        }
    });
}
// POST /api/categorias  (solo admin)
function crear(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { nombre, descripcion } = req.body;
            if (!nombre)
                return res.status(400).json({ error: 'El nombre es requerido.' });
            const [result] = yield db_1.default.query('INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion || null]);
            res.status(201).json({ message: 'Categoría creada.', id: result.insertId });
        }
        catch (err) {
            next(err);
        }
    });
}
