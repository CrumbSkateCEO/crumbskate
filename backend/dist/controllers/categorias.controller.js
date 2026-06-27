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
exports.actualizar = actualizar;
exports.eliminar = eliminar;
const db_1 = __importDefault(require("../config/db"));
const client_1 = require("@prisma/client");
// GET /api/categorias
function listar(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categorias = yield db_1.default.categoria.findMany({
                orderBy: { nombre: 'asc' },
                select: { id: true, nombre: true, descripcion: true },
            });
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
            const categoria = yield db_1.default.categoria.create({
                data: { nombre, descripcion: descripcion || null },
                select: { id: true },
            });
            res.status(201).json({ message: 'Categoría creada.', id: categoria.id });
        }
        catch (err) {
            next(err);
        }
    });
}
// PUT /api/categorias/:id
function actualizar(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { nombre, descripcion } = req.body;
            if (!nombre)
                return res.status(400).json({ error: 'El nombre es requerido.' });
            yield db_1.default.categoria.update({
                where: { id: parseInt(id) },
                data: { nombre, descripcion: descripcion || null },
            });
            res.json({ message: 'Categoría actualizada.' });
        }
        catch (err) {
            next(err);
        }
    });
}
// DELETE /api/categorias/:id
function eliminar(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            yield db_1.default.categoria.delete({ where: { id: parseInt(id) } });
            res.json({ message: 'Categoría eliminada.' });
        }
        catch (err) {
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
                return res.status(400).json({
                    error: 'No se puede eliminar la categoría porque hay productos asignados a ella.',
                });
            }
            next(err);
        }
    });
}
