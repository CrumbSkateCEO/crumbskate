const router = require("express").Router();
const { body } = require("express-validator");
const { registro, login, perfil } = require("../controllers/auth.controller");
const { verificarToken } = require("../middleware/auth");

const validarRegistro = [
  body("nombre").trim().notEmpty().withMessage("El nombre es requerido."),
  body("email").isEmail().normalizeEmail().withMessage("Email inválido."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres.")
    .matches(/\d/)
    .withMessage("La contraseña debe incluir al menos un número."),
];

const validarLogin = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
];

router.post("/registro", validarRegistro, registro);
router.post("/login", validarLogin, login);
router.get("/perfil", verificarToken, perfil);

module.exports = router;
