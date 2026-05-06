"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const productos_controller_1 = require("../controllers/productos.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const validarProducto = [
    (0, express_validator_1.body)('nombre').trim().notEmpty().withMessage('El nombre es requerido.'),
    (0, express_validator_1.body)('categoria_id').isInt({ min: 1 }).withMessage('categoria_id debe ser un entero válido.'),
    (0, express_validator_1.body)('codigo_sku').trim().notEmpty().withMessage('El SKU es requerido.'),
    (0, express_validator_1.body)('precio_base').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo.'),
];
router.get('/', productos_controller_1.listar);
router.get('/:id', productos_controller_1.detalle);
router.post('/', auth_1.verificarToken, auth_1.soloAdmin, validarProducto, productos_controller_1.crear);
router.put('/:id', auth_1.verificarToken, auth_1.soloAdmin, productos_controller_1.actualizar);
router.delete('/:id', auth_1.verificarToken, auth_1.soloAdmin, productos_controller_1.eliminar);
exports.default = router;
