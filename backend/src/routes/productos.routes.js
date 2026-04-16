const router = require("express").Router();
const { body } = require("express-validator");
const { listar, detalle, crear, actualizar, eliminar } = require("../controllers/productos.controller");
const { verificarToken, soloAdmin } = require("../middleware/auth");

const validarProducto = [
  body("nombre").trim().notEmpty().withMessage("El nombre es requerido."),
  body("categoria_id").isInt({ min: 1 }).withMessage("categoria_id debe ser un entero válido."),
  body("codigo_sku").trim().notEmpty().withMessage("El SKU es requerido."),
  body("precio_base").isFloat({ min: 0 }).withMessage("El precio debe ser un número positivo."),
];

router.get("/", listar);
router.get("/:id", detalle);
router.post("/", verificarToken, soloAdmin, validarProducto, crear);
router.put("/:id", verificarToken, soloAdmin, actualizar);
router.delete("/:id", verificarToken, soloAdmin, eliminar);

module.exports = router;
