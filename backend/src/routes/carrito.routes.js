const router = require("express").Router();
const { ver, agregar, eliminarItem, vaciar } = require("../controllers/carrito.controller");
const { verificarToken } = require("../middleware/auth");

// Todas las rutas del carrito requieren estar autenticado
router.use(verificarToken);

router.get("/", ver);
router.post("/agregar", agregar);
router.delete("/item/:itemId", eliminarItem);
router.delete("/vaciar", vaciar);

module.exports = router;
