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
exports.crear = crear;
exports.historial = historial;
exports.detalle = detalle;
const db_1 = __importDefault(require("../config/db"));
// POST /api/pedidos  - crea un pedido desde el carrito
function crear(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const conn = yield db_1.default.getConnection();
        try {
            yield conn.beginTransaction(); // Todo o nada
            // Obtener carrito del usuario
            const [carritos] = yield conn.query('SELECT id FROM carrito WHERE usuario_id = ? LIMIT 1', [(_a = req.usuario) === null || _a === void 0 ? void 0 : _a.id]);
            if (carritos.length === 0) {
                return res.status(400).json({ error: 'No tenés un carrito activo.' });
            }
            const carritoId = carritos[0].id;
            // Obtener items del carrito
            const [items] = yield conn.query(`SELECT ci.variante_id, ci.cantidad,
              v.stock, v.precio_extra,
              p.precio_base
       FROM carrito_items ci
       JOIN variantes v ON ci.variante_id = v.id
       JOIN productos p ON v.producto_id = p.id
       WHERE ci.carrito_id = ?`, [carritoId]);
            if (items.length === 0) {
                return res.status(400).json({ error: 'El carrito está vacío.' });
            }
            // Verificar stock de cada item
            for (const item of items) {
                if (item.stock < item.cantidad) {
                    yield conn.rollback();
                    return res.status(400).json({ error: 'Stock insuficiente para uno o más productos.' });
                }
            }
            // Calcular total
            const total = items.reduce((acc, i) => acc + (parseFloat(i.precio_base) + parseFloat(i.precio_extra)) * i.cantidad, 0);
            // Crear pedido
            const [pedido] = yield conn.query("INSERT INTO pedidos (usuario_id, total, estado) VALUES (?, ?, 'pendiente')", [(_b = req.usuario) === null || _b === void 0 ? void 0 : _b.id, total.toFixed(2)]);
            const pedidoId = pedido.insertId;
            // Insertar items del pedido y descontar stock
            for (const item of items) {
                const precioUnitario = parseFloat(item.precio_base) + parseFloat(item.precio_extra);
                yield conn.query('INSERT INTO pedido_items (pedido_id, variante_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)', [pedidoId, item.variante_id, item.cantidad, precioUnitario]);
                yield conn.query('UPDATE variantes SET stock = stock - ? WHERE id = ?', [item.cantidad, item.variante_id]);
            }
            // Registrar pago pendiente
            yield conn.query("INSERT INTO pagos (pedido_id, estado, monto) VALUES (?, 'pendiente', ?)", [pedidoId, total.toFixed(2)]);
            // Vaciar carrito
            yield conn.query('DELETE FROM carrito_items WHERE carrito_id = ?', [carritoId]);
            yield conn.commit();
            res.status(201).json({ message: 'Pedido creado.', pedidoId, total: total.toFixed(2) });
        }
        catch (err) {
            yield conn.rollback();
            next(err);
        }
        finally {
            conn.release();
        }
    });
}
// GET /api/pedidos  - historial del usuario
function historial(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const [pedidos] = yield db_1.default.query(`SELECT p.id, p.estado, p.total, p.ml_order_id, p.created_at,
              COUNT(pi.id) AS cantidad_items
       FROM pedidos p
       LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
       WHERE p.usuario_id = ?
       GROUP BY p.id
       ORDER BY p.created_at DESC`, [(_a = req.usuario) === null || _a === void 0 ? void 0 : _a.id]);
            res.json(pedidos);
        }
        catch (err) {
            next(err);
        }
    });
}
// GET /api/pedidos/:id  - detalle de un pedido
function detalle(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const [pedidos] = yield db_1.default.query('SELECT * FROM pedidos WHERE id = ? AND usuario_id = ?', [req.params.id, (_a = req.usuario) === null || _a === void 0 ? void 0 : _a.id]);
            if (pedidos.length === 0) {
                return res.status(404).json({ error: 'Pedido no encontrado.' });
            }
            const [items] = yield db_1.default.query(`SELECT pi.cantidad, pi.precio_unitario,
              p.nombre, v.talla, v.color
       FROM pedido_items pi
       JOIN variantes v ON pi.variante_id = v.id
       JOIN productos p ON v.producto_id = p.id
       WHERE pi.pedido_id = ?`, [req.params.id]);
            res.json(Object.assign(Object.assign({}, pedidos[0]), { items }));
        }
        catch (err) {
            next(err);
        }
    });
}
