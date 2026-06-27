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
exports.detalle = detalle;
exports.crear = crear;
exports.actualizar = actualizar;
exports.eliminar = eliminar;
const db_1 = __importDefault(require("../config/db"));
const express_validator_1 = require("express-validator");
// GET /api/productos
function listar(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { categoria_id, marca, genero, buscar, pagina = 1, limite = 12 } = req.query;
            const take = parseInt(limite);
            const skip = (parseInt(pagina) - 1) * take;
            const where = Object.assign(Object.assign(Object.assign(Object.assign({ activo: true }, (categoria_id && { categoria_id: parseInt(categoria_id) })), (marca && { marca: marca })), (genero && { genero: genero })), (buscar && {
                OR: [
                    { nombre: { contains: buscar, mode: 'insensitive' } },
                    { descripcion: { contains: buscar, mode: 'insensitive' } },
                ],
            }));
            const productos = yield db_1.default.producto.findMany({
                where,
                orderBy: { id: 'desc' },
                take,
                skip,
                include: {
                    categoria: { select: { nombre: true } },
                    variantes: {
                        select: { id: true, talla: true, color: true, stock: true, precio_extra: true },
                    },
                },
            });
            const resultado = productos.map((p) => {
                var _a;
                return ({
                    id: p.id,
                    nombre: p.nombre,
                    descripcion: p.descripcion,
                    marca: p.marca,
                    codigo_sku: p.codigo_sku,
                    precio_base: p.precio_base,
                    imagen_url: p.imagen_url,
                    mercadolibre_url: p.mercadolibre_url,
                    genero: p.genero,
                    categoria: (_a = p.categoria) === null || _a === void 0 ? void 0 : _a.nombre,
                    variantes: p.variantes,
                });
            });
            res.json(resultado);
        }
        catch (err) {
            next(err);
        }
    });
}
// GET /api/productos/:id
function detalle(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const producto = yield db_1.default.producto.findFirst({
                where: { id: parseInt(req.params.id), activo: true },
                include: {
                    categoria: { select: { nombre: true } },
                    variantes: {
                        select: { id: true, talla: true, color: true, stock: true, precio_extra: true },
                    },
                },
            });
            if (!producto) {
                return res.status(404).json({ error: 'Producto no encontrado.' });
            }
            res.json(Object.assign(Object.assign({}, producto), { categoria: (_a = producto.categoria) === null || _a === void 0 ? void 0 : _a.nombre, variantes: producto.variantes }));
        }
        catch (err) {
            next(err);
        }
    });
}
// POST /api/productos  (solo admin)
function crear(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const errores = (0, express_validator_1.validationResult)(req);
            if (!errores.isEmpty()) {
                return res.status(400).json({ errores: errores.array() });
            }
            const { categoria_id, nombre, descripcion, marca, codigo_sku, precio_base, mercadolibre_url, genero = 'unisex' } = req.body;
            const imagen_url = req.file ? `/${req.file.filename}` : req.body.imagen_url;
            let variantes = [];
            if (req.body.variantes) {
                try {
                    variantes = JSON.parse(req.body.variantes);
                }
                catch (e) { }
            }
            if (variantes.length === 0) {
                variantes = [{ talla: 'Único', stock: 10 }];
            }
            const producto = yield db_1.default.producto.create({
                data: {
                    categoria_id: parseInt(categoria_id),
                    nombre,
                    descripcion,
                    marca,
                    codigo_sku,
                    precio_base,
                    imagen_url: imagen_url || null,
                    mercadolibre_url: mercadolibre_url || null,
                    genero,
                    variantes: {
                        create: variantes.map((v) => ({
                            talla: v.talla || 'Único',
                            color: 'Único',
                            stock: v.stock || 0,
                            precio_extra: 0,
                        })),
                    },
                },
                select: { id: true },
            });
            res.status(201).json({ message: 'Producto creado.', id: producto.id });
        }
        catch (err) {
            next(err);
        }
    });
}
// PUT /api/productos/:id  (solo admin)
function actualizar(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const errores = (0, express_validator_1.validationResult)(req);
            if (!errores.isEmpty()) {
                return res.status(400).json({ errores: errores.array() });
            }
            const { nombre, descripcion, marca, precio_base, mercadolibre_url, activo, genero } = req.body;
            const id = parseInt(req.params.id);
            let imagen_url = req.body.imagen_url;
            if (req.file) {
                imagen_url = `/${req.file.filename}`;
            }
            const data = {};
            if (nombre !== undefined)
                data.nombre = nombre;
            if (descripcion !== undefined)
                data.descripcion = descripcion;
            if (marca !== undefined)
                data.marca = marca;
            if (precio_base !== undefined)
                data.precio_base = precio_base;
            if (imagen_url !== undefined)
                data.imagen_url = imagen_url;
            if (mercadolibre_url !== undefined)
                data.mercadolibre_url = mercadolibre_url;
            if (activo !== undefined)
                data.activo = activo;
            if (genero !== undefined)
                data.genero = genero;
            yield db_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield tx.producto.update({ where: { id }, data });
                if (req.body.variantes) {
                    try {
                        const variantes = JSON.parse(req.body.variantes);
                        if (variantes.length > 0) {
                            yield tx.variante.deleteMany({ where: { producto_id: id } });
                            yield tx.variante.createMany({
                                data: variantes.map((v) => ({
                                    producto_id: id,
                                    talla: v.talla || 'Único',
                                    color: 'Único',
                                    stock: v.stock || 0,
                                    precio_extra: 0,
                                })),
                            });
                        }
                    }
                    catch (e) {
                        console.error('Error parsing variantes in update', e);
                    }
                }
            }));
            res.json({ message: 'Producto actualizado.' });
        }
        catch (err) {
            next(err);
        }
    });
}
// DELETE /api/productos/:id  (solo admin - baja lógica)
function eliminar(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield db_1.default.producto.update({
                where: { id: parseInt(req.params.id) },
                data: { activo: false },
            });
            res.json({ message: 'Producto desactivado.' });
        }
        catch (err) {
            next(err);
        }
    });
}
