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
exports.ver = ver;
exports.agregar = agregar;
exports.eliminarItem = eliminarItem;
exports.vaciar = vaciar;
const db_1 = __importDefault(require("../config/db"));
function obtenerOCrearCarrito(usuarioId) {
    return __awaiter(this, void 0, void 0, function* () {
        const existente = yield db_1.default.carrito.findUnique({
            where: { usuario_id: usuarioId },
            select: { id: true },
        });
        if (existente)
            return existente.id;
        const carrito = yield db_1.default.carrito.create({
            data: { usuario_id: usuarioId },
            select: { id: true },
        });
        return carrito.id;
    });
}
// GET /api/carrito
function ver(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const carritoId = yield obtenerOCrearCarrito((_a = req.usuario) === null || _a === void 0 ? void 0 : _a.id);
            const items = yield db_1.default.carritoItem.findMany({
                where: { carrito_id: carritoId },
                include: {
                    variante: {
                        include: {
                            producto: { select: { nombre: true, precio_base: true, imagen_url: true } },
                        },
                    },
                },
            });
            const resultado = items.map((ci) => {
                const precioBase = Number(ci.variante.producto.precio_base);
                const precioExtra = Number(ci.variante.precio_extra);
                const subtotal = (precioBase + precioExtra) * ci.cantidad;
                return {
                    id: ci.id,
                    cantidad: ci.cantidad,
                    talla: ci.variante.talla,
                    color: ci.variante.color,
                    precio_extra: ci.variante.precio_extra,
                    nombre: ci.variante.producto.nombre,
                    precio_base: ci.variante.producto.precio_base,
                    imagen_url: ci.variante.producto.imagen_url,
                    subtotal: subtotal.toFixed(2),
                };
            });
            const total = resultado.reduce((acc, i) => acc + parseFloat(i.subtotal), 0);
            res.json({ carritoId, items: resultado, total: total.toFixed(2) });
        }
        catch (err) {
            next(err);
        }
    });
}
// POST /api/carrito/agregar
function agregar(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { variante_id, cantidad = 1 } = req.body;
            if (!variante_id)
                return res.status(400).json({ error: 'variante_id requerido.' });
            const variante = yield db_1.default.variante.findUnique({
                where: { id: variante_id },
                select: { stock: true },
            });
            if (!variante) {
                return res.status(404).json({ error: 'Variante no encontrada.' });
            }
            if (variante.stock < cantidad) {
                return res.status(400).json({ error: 'Stock insuficiente.' });
            }
            const carritoId = yield obtenerOCrearCarrito((_a = req.usuario) === null || _a === void 0 ? void 0 : _a.id);
            const existente = yield db_1.default.carritoItem.findFirst({
                where: { carrito_id: carritoId, variante_id },
            });
            if (existente) {
                yield db_1.default.carritoItem.update({
                    where: { id: existente.id },
                    data: { cantidad: { increment: cantidad } },
                });
            }
            else {
                yield db_1.default.carritoItem.create({
                    data: { carrito_id: carritoId, variante_id, cantidad },
                });
            }
            res.json({ message: 'Producto agregado al carrito.' });
        }
        catch (err) {
            next(err);
        }
    });
}
// DELETE /api/carrito/item/:itemId
function eliminarItem(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const carritoId = yield obtenerOCrearCarrito((_a = req.usuario) === null || _a === void 0 ? void 0 : _a.id);
            yield db_1.default.carritoItem.deleteMany({
                where: { id: parseInt(req.params.itemId), carrito_id: carritoId },
            });
            res.json({ message: 'Item eliminado del carrito.' });
        }
        catch (err) {
            next(err);
        }
    });
}
// DELETE /api/carrito/vaciar
function vaciar(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const carritoId = yield obtenerOCrearCarrito((_a = req.usuario) === null || _a === void 0 ? void 0 : _a.id);
            yield db_1.default.carritoItem.deleteMany({ where: { carrito_id: carritoId } });
            res.json({ message: 'Carrito vaciado.' });
        }
        catch (err) {
            next(err);
        }
    });
}
