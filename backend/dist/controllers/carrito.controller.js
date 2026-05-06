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
// Obtiene o crea el carrito activo del usuario
function obtenerOCrearCarrito(usuarioId) {
    return __awaiter(this, void 0, void 0, function* () {
        const [carritos] = yield db_1.default.query('SELECT id FROM carrito WHERE usuario_id = ? LIMIT 1', [usuarioId]);
        if (carritos.length > 0)
            return carritos[0].id;
        const [result] = yield db_1.default.query('INSERT INTO carrito (usuario_id) VALUES (?)', [usuarioId]);
        return result.insertId;
    });
}
// GET /api/carrito
function ver(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const carritoId = yield obtenerOCrearCarrito((_a = req.usuario) === null || _a === void 0 ? void 0 : _a.id);
            const [items] = yield db_1.default.query(`SELECT ci.id, ci.cantidad,
              v.talla, v.color, v.precio_extra,
              p.nombre, p.precio_base, p.imagen_url,
              (p.precio_base + v.precio_extra) * ci.cantidad AS subtotal
       FROM carrito_items ci
       JOIN variantes v ON ci.variante_id = v.id
       JOIN productos p ON v.producto_id = p.id
       WHERE ci.carrito_id = ?`, [carritoId]);
            const total = items.reduce((acc, i) => acc + parseFloat(i.subtotal), 0);
            res.json({ carritoId, items, total: total.toFixed(2) });
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
            // Verificar stock disponible
            const [variantes] = yield db_1.default.query('SELECT stock FROM variantes WHERE id = ?', [variante_id]);
            if (variantes.length === 0) {
                return res.status(404).json({ error: 'Variante no encontrada.' });
            }
            if (variantes[0].stock < cantidad) {
                return res.status(400).json({ error: 'Stock insuficiente.' });
            }
            const carritoId = yield obtenerOCrearCarrito((_a = req.usuario) === null || _a === void 0 ? void 0 : _a.id);
            // Si ya existe el item, incrementar cantidad
            const [existente] = yield db_1.default.query('SELECT id, cantidad FROM carrito_items WHERE carrito_id = ? AND variante_id = ?', [carritoId, variante_id]);
            if (existente.length > 0) {
                yield db_1.default.query('UPDATE carrito_items SET cantidad = cantidad + ? WHERE id = ?', [cantidad, existente[0].id]);
            }
            else {
                yield db_1.default.query('INSERT INTO carrito_items (carrito_id, variante_id, cantidad) VALUES (?, ?, ?)', [carritoId, variante_id, cantidad]);
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
            yield db_1.default.query('DELETE FROM carrito_items WHERE id = ? AND carrito_id = ?', [req.params.itemId, carritoId]);
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
            yield db_1.default.query('DELETE FROM carrito_items WHERE carrito_id = ?', [carritoId]);
            res.json({ message: 'Carrito vaciado.' });
        }
        catch (err) {
            next(err);
        }
    });
}
