"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const db_1 = __importDefault(require("./config/db"));
// Import Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const carrito_routes_1 = __importDefault(require("./routes/carrito.routes"));
const categorias_routes_1 = __importDefault(require("./routes/categorias.routes"));
const pedidos_routes_1 = __importDefault(require("./routes/pedidos.routes"));
const productos_routes_1 = __importDefault(require("./routes/productos.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const cupones_routes_1 = __importDefault(require("./routes/cupones.routes"));
const resenas_routes_1 = __importDefault(require("./routes/resenas.routes"));
const configuracion_routes_1 = __importDefault(require("./routes/configuracion.routes"));
const usuarios_routes_1 = __importDefault(require("./routes/usuarios.routes"));
const stock_routes_1 = __importDefault(require("./routes/stock.routes"));
const reportes_routes_1 = __importDefault(require("./routes/reportes.routes"));
// Import Error Handler
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);
// Middlewares de Seguridad
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error(`CORS: origen no permitido (${origin})`));
    },
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
})); // Añade cabeceras HTTP de seguridad pero permite cargar imágenes en el frontend
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 peticiones por IP cada 15 min
    message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo en 15 minutos.'
});
app.use('/api/', limiter); // Aplica el límite a todas las rutas de la API
const path_1 = __importDefault(require("path"));
app.use(express_1.default.json());
app.use('/', express_1.default.static(path_1.default.join(__dirname, '../uploads'), {
    setHeaders: (res, filePath) => {
        // Si el archivo no tiene extensión, forzamos un Content-Type de imagen
        // para que el navegador lo interprete correctamente a pesar del header "nosniff"
        if (!filePath.includes('.')) {
            res.set('Content-Type', 'image/jpeg');
        }
    }
}));
// 1. Health check route
app.get('/api/health', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.default.$queryRaw `SELECT 1`;
        res.status(200).json({
            status: 'ok',
            message: 'Server is running and Database is connected',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server is running but Database connection failed'
        });
    }
}));
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/carrito', carrito_routes_1.default);
app.use('/api/categorias', categorias_routes_1.default);
app.use('/api/pedidos', pedidos_routes_1.default);
app.use('/api/productos', productos_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/cupones', cupones_routes_1.default);
app.use('/api/resenas', resenas_routes_1.default);
app.use('/api/configuracion', configuracion_routes_1.default);
app.use('/api/usuarios', usuarios_routes_1.default);
app.use('/api/stock', stock_routes_1.default);
app.use('/api/reportes', reportes_routes_1.default);
// Manejo centralizado de errores (debe ser el último middleware)
app.use(errorHandler_1.default);
// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
