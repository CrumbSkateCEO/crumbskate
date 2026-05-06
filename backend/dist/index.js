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
const db_1 = __importDefault(require("./config/db"));
// Import Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const carrito_routes_1 = __importDefault(require("./routes/carrito.routes"));
const categorias_routes_1 = __importDefault(require("./routes/categorias.routes"));
const pedidos_routes_1 = __importDefault(require("./routes/pedidos.routes"));
const productos_routes_1 = __importDefault(require("./routes/productos.routes"));
// Import Error Handler
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 1. Health check route
app.get('/api/health', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.default.query('SELECT 1');
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
// Manejo centralizado de errores (debe ser el último middleware)
app.use(errorHandler_1.default);
// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
