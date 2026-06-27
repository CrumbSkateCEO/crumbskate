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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crear = crear;
exports.historial = historial;
exports.detalle = detalle;
exports.todos = todos;
exports.cancelar = cancelar;
const db_1 = __importDefault(require("../config/db"));
// POST /api/pedidos  - crea un pedido desde el carrito
function crear(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resultado = yield db_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const carrito = yield tx.carrito.findFirst({
                    where: { usuario_id: (_a = req.usuario) === null || _a === void 0 ? void 0 : _a.id },
                });
                if (!carrito) {
                    throw Object.assign(new Error('No tenés un carrito activo.'), { statusCode: 400 });
                }
                const items = yield tx.carritoItem.findMany({
                    where: { carrito_id: carrito.id },
                    include: {
                        variante: { include: { producto: { select: { precio_base: true } } } },
                    },
                });
                if (items.length === 0) {
                    throw Object.assign(new Error('El carrito está vacío.'), { statusCode: 400 });
                }
                for (const item of items) {
                    if (item.variante.stock < item.cantidad) {
                        throw Object.assign(new Error('Stock insuficiente para uno o más productos.'), { statusCode: 400 });
                    }
                }
                const total = items.reduce((acc, item) => {
                    const precio = Number(item.variante.producto.precio_base) + Number(item.variante.precio_extra);
                    return acc + precio * item.cantidad;
                }, 0);
                const pedido = yield tx.pedido.create({
                    data: {
                        usuario_id: req.usuario.id,
                        total,
                        estado: 'pendiente',
                    },
                });
                for (const item of items) {
                    const precioUnitario = Number(item.variante.producto.precio_base) + Number(item.variante.precio_extra);
                    yield tx.pedidoItem.create({
                        data: {
                            pedido_id: pedido.id,
                            variante_id: item.variante_id,
                            cantidad: item.cantidad,
                            precio_unitario: precioUnitario,
                        },
                    });
                    yield tx.variante.update({
                        where: { id: item.variante_id },
                        data: { stock: { decrement: item.cantidad } },
                    });
                }
                yield tx.pago.create({
                    data: { pedido_id: pedido.id, estado: 'pendiente', monto: total },
                });
                yield tx.carritoItem.deleteMany({ where: { carrito_id: carrito.id } });
                return { pedidoId: pedido.id, total };
            }));
            res.status(201).json({
                message: 'Pedido creado.',
                pedidoId: resultado.pedidoId,
                total: Number(resultado.total).toFixed(2),
            });
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({ error: err.message });
            }
            next(err);
        }
    });
}
// GET /api/pedidos  - historial del usuario
function historial(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const pedidos = yield db_1.default.pedido.findMany({
                where: { usuario_id: (_a = req.usuario) === null || _a === void 0 ? void 0 : _a.id },
                orderBy: { created_at: 'desc' },
                include: { _count: { select: { items: true } } },
            });
            res.json(pedidos.map((p) => ({
                id: p.id,
                estado: p.estado,
                total: p.total,
                ml_order_id: p.ml_order_id,
                created_at: p.created_at,
                cantidad_items: p._count.items,
            })));
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
            const pedido = yield db_1.default.pedido.findFirst({
                where: { id: parseInt(req.params.id), usuario_id: (_a = req.usuario) === null || _a === void 0 ? void 0 : _a.id },
                include: {
                    items: {
                        include: {
                            variante: {
                                include: { producto: { select: { nombre: true } } },
                            },
                        },
                    },
                },
            });
            if (!pedido) {
                return res.status(404).json({ error: 'Pedido no encontrado.' });
            }
            const items = pedido.items.map((pi) => {
                var _a, _b, _c;
                return ({
                    cantidad: pi.cantidad,
                    precio_unitario: pi.precio_unitario,
                    nombre: (_a = pi.variante) === null || _a === void 0 ? void 0 : _a.producto.nombre,
                    talla: (_b = pi.variante) === null || _b === void 0 ? void 0 : _b.talla,
                    color: (_c = pi.variante) === null || _c === void 0 ? void 0 : _c.color,
                });
            });
            const { items: _ } = pedido, pedidoData = __rest(pedido, ["items"]);
            res.json(Object.assign(Object.assign({}, pedidoData), { items }));
        }
        catch (err) {
            next(err);
        }
    });
}
// GET /api/pedidos/todos  - todos los pedidos (solo admin)
function todos(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pedidos = yield db_1.default.pedido.findMany({
                orderBy: { created_at: 'desc' },
                include: {
                    usuario: { select: { nombre: true, email: true } },
                },
            });
            res.json(pedidos.map((p) => ({
                id: p.id,
                estado: p.estado,
                total: p.total,
                created_at: p.created_at,
                cliente: p.usuario.nombre,
                email: p.usuario.email,
            })));
        }
        catch (err) {
            next(err);
        }
    });
}
// PUT /api/pedidos/:id/cancelar
function cancelar(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield db_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const pedido = yield tx.pedido.findFirst({
                    where: { id: parseInt(req.params.id), usuario_id: (_a = req.usuario) === null || _a === void 0 ? void 0 : _a.id },
                });
                if (!pedido) {
                    throw Object.assign(new Error('Pedido no encontrado.'), { statusCode: 404 });
                }
                if (pedido.estado !== 'pendiente') {
                    throw Object.assign(new Error('Solo se pueden cancelar pedidos pendientes.'), { statusCode: 400 });
                }
                yield tx.pedido.update({
                    where: { id: pedido.id },
                    data: { estado: 'cancelado' },
                });
                const items = yield tx.pedidoItem.findMany({
                    where: { pedido_id: pedido.id },
                    select: { variante_id: true, cantidad: true },
                });
                for (const item of items) {
                    if (item.variante_id) {
                        yield tx.variante.update({
                            where: { id: item.variante_id },
                            data: { stock: { increment: item.cantidad } },
                        });
                    }
                }
            }));
            res.json({ message: 'Pedido cancelado exitosamente.' });
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({ error: err.message });
            }
            next(err);
        }
    });
}
