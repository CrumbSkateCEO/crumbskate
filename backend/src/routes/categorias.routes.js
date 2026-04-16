const router = require("express").Router();
const { listar, crear } = require("../controllers/categorias.controller");
const { verificarToken, soloAdmin } = require("../middleware/auth");

router.get("/", listar);
router.post("/", verificarToken, soloAdmin, crear);

module.exports = router;
