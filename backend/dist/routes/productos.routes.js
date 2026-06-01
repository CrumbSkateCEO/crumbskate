"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const productos_controller_1 = require("../controllers/productos.controller");
const auth_1 = require("../middlewares/auth");
const upload_1 = __importDefault(require("../middlewares/upload"));
const router = (0, express_1.Router)();
router.get('/', productos_controller_1.listar);
router.get('/:id', productos_controller_1.detalle);
// Rutas protegidas (solo admin)
router.use(auth_1.verificarToken);
router.use(auth_1.soloAdmin);
router.post('/', upload_1.default.single('image'), [
    (0, express_validator_1.body)('nombre').notEmpty().withMessage('El nombre es requerido.'),
    (0, express_validator_1.body)('precio_base').isNumeric().withMessage('El precio debe ser número.'),
    (0, express_validator_1.body)('categoria_id').isInt().withMessage('ID de categoría inválido.'),
], productos_controller_1.crear);
router.put('/:id', upload_1.default.single('image'), [
    (0, express_validator_1.body)('precio_base').optional().isNumeric(),
], productos_controller_1.actualizar);
router.delete('/:id', productos_controller_1.eliminar);
exports.default = router;
