import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pool from './config/db';

// Import Routes
import authRoutes from './routes/auth.routes';
import carritoRoutes from './routes/carrito.routes';
import categoriasRoutes from './routes/categorias.routes';
import pedidosRoutes from './routes/pedidos.routes';
import productosRoutes from './routes/productos.routes';

// Import Error Handler
import errorHandler from './middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares de Seguridad
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(helmet()); // Añade cabeceras HTTP de seguridad

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 peticiones por IP cada 15 min
  message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo en 15 minutos.'
});
app.use('/api/', limiter); // Aplica el límite a todas las rutas de la API

app.use(express.json());

// 1. Health check route
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({
      status: 'ok',
      message: 'Server is running and Database is connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server is running but Database connection failed'
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/productos', productosRoutes);

// Manejo centralizado de errores (debe ser el último middleware)
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
