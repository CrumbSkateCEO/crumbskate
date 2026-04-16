require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const { testConnection } = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth.routes");
const productosRoutes = require("./routes/productos.routes");
const categoriasRoutes = require("./routes/categorias.routes");
const carritoRoutes = require("./routes/carrito.routes");
const pedidosRoutes = require("./routes/pedidos.routes");

const app = express();

// ── Seguridad ──────────────────────────────────────────────
// Helmet: configura headers HTTP de seguridad automáticamente
app.use(helmet());

// CORS: solo permite requests desde el frontend definido en .env
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting global: máximo 100 requests cada 15 minutos por IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Demasiadas peticiones. Intentá de nuevo en 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Rate limiting estricto para login/registro: 10 intentos por 15 min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Demasiados intentos de autenticación." },
});

// ── Body parser ───────────────────────────────────────────
app.use(express.json({ limit: "10kb" })); // Limitar tamaño del body

// ── Rutas ─────────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api/pedidos", pedidosRoutes);

// Health check - útil para Railway
app.get("/health", (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada." });
});

// ── Manejo de errores ─────────────────────────────────────
app.use(errorHandler);

// ── Inicio ────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

async function iniciar() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🛹 Crumbskate API corriendo en http://localhost:${PORT}`);
    console.log(`📦 Ambiente: ${process.env.NODE_ENV}`);
  });
}

iniciar();
