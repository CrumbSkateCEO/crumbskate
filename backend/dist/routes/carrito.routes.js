"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carrito_controller_1 = require("../controllers/carrito.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Todas las rutas del carrito requieren estar autenticado
router.use(auth_1.verificarToken);
router.get('/', carrito_controller_1.ver);
router.post('/agregar', carrito_controller_1.agregar);
router.delete('/item/:itemId', carrito_controller_1.eliminarItem);
router.delete('/vaciar', carrito_controller_1.vaciar);
exports.default = router;
