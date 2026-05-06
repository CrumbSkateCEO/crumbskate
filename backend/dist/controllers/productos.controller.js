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
// GET /api/productos  - listar con filtros opcionales
function listar(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { categoria_id, marca, buscar, pagina = 1, limite = 12 } = req.query;
            const offset = (parseInt(pagina) - 1) * parseInt(limite);
            let query = `
      SELECT p.id, p.nombre, p.descripcion, p.marca, p.codigo_sku,
             p.precio_base, p.imagen_url, p.mercadolibre_url,
             c.nombre AS categoria
      FROM productos p
      JOIN categorias c ON p.categoria_id = c.id
      WHERE p.activo = 1
    `;
            const params = [];
            if (categoria_id) {
                query += ' AND p.categoria_id = ?';
                params.push(categoria_id);
            }
            if (marca) {
                query += ' AND p.marca = ?';
                params.push(marca);
            }
            if (buscar) {
                query += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ?)';
                params.push(`%${buscar}%`, `%${buscar}%`);
            }
            query += ' ORDER BY p.id DESC LIMIT ? OFFSET ?';
            params.push(parseInt(limite), offset);
            const [productos] = yield db_1.default.query(query, params);
            res.json(productos);
        }
        catch (err) {
            next(err);
        }
    });
}
// GET /api/productos/:id  - detalle con variantes
function detalle(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [productos] = yield db_1.default.query(`SELECT p.*, c.nombre AS categoria
       FROM productos p
       JOIN categorias c ON p.categoria_id = c.id
       WHERE p.id = ? AND p.activo = 1`, [req.params.id]);
            if (productos.length === 0) {
                return res.status(404).json({ error: 'Producto no encontrado.' });
            }
            const [variantes] = yield db_1.default.query('SELECT id, talla, color, stock, precio_extra FROM variantes WHERE producto_id = ?', [req.params.id]);
            res.json(Object.assign(Object.assign({}, productos[0]), { variantes }));
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
            const { categoria_id, nombre, descripcion, marca, codigo_sku, precio_base, imagen_url, mercadolibre_url } = req.body;
            const [result] = yield db_1.default.query(`INSERT INTO productos
        (categoria_id, nombre, descripcion, marca, codigo_sku, precio_base, imagen_url, mercadolibre_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [categoria_id, nombre, descripcion, marca, codigo_sku,
                precio_base, imagen_url || null, mercadolibre_url || null]);
            res.status(201).json({ message: 'Producto creado.', id: result.insertId });
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
            const { nombre, descripcion, marca, precio_base, imagen_url, mercadolibre_url, activo } = req.body;
            yield db_1.default.query(`UPDATE productos SET
        nombre = COALESCE(?, nombre),
        descripcion = COALESCE(?, descripcion),
        marca = COALESCE(?, marca),
        precio_base = COALESCE(?, precio_base),
        imagen_url = COALESCE(?, imagen_url),
        mercadolibre_url = COALESCE(?, mercadolibre_url),
        activo = COALESCE(?, activo)
       WHERE id = ?`, [nombre, descripcion, marca, precio_base, imagen_url,
                mercadolibre_url, activo, req.params.id]);
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
            yield db_1.default.query('UPDATE productos SET activo = 0 WHERE id = ?', [req.params.id]);
            res.json({ message: 'Producto desactivado.' });
        }
        catch (err) {
            next(err);
        }
    });
}
