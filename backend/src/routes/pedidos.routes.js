const router = require("express").Router();
const { crear, historial, detalle } = require("../controllers/pedidos.controller");
const { verificarToken } = require("../middleware/auth");

router.use(verificarToken);

router.post("/", crear);
router.get("/", historial);
router.get("/:id", detalle);

module.exports = router;
