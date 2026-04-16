const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");
const { validationResult } = require("express-validator");

// POST /api/auth/registro
async function registro(req, res, next) {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { nombre, email, password, telefono } = req.body;

    // Verificar si el email ya existe
    const [existente] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );
    if (existente.length > 0) {
      return res.status(409).json({ error: "El email ya está registrado." });
    }

    // Hashear contraseña (10 rondas = balance seguridad/velocidad)
    const hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, email, password_hash, telefono) VALUES (?, ?, ?, ?)",
      [nombre, email, hash, telefono || null]
    );

    res.status(201).json({
      message: "Usuario registrado correctamente.",
      id: result.insertId,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { email, password } = req.body;

    const [rows] = await pool.query(
      "SELECT id, nombre, email, password_hash, rol FROM usuarios WHERE email = ?",
      [email]
    );

    // Mismo mensaje para email o password incorrecto (evita enumerar usuarios)
    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    const usuario = rows[0];
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValida) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/perfil  (requiere token)
async function perfil(req, res, next) {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, email, telefono, rol, created_at FROM usuarios WHERE id = ?",
      [req.usuario.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = { registro, login, perfil };
