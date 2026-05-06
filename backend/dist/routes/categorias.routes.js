"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categorias_controller_1 = require("../controllers/categorias.controller");
const router = (0, express_1.Router)();
router.get('/', categorias_controller_1.listar);
router.post('/', categorias_controller_1.crear); // (solo admin) Nota: no hay middleware en la ruta original, se podría agregar
exports.default = router;
