import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import prisma from './config/db';

// Import Routes
import authRoutes from './routes/auth.routes';
import carritoRoutes from './routes/carrito.routes';
import categoriasRoutes from './routes/categorias.routes';
import pedidosRoutes from './routes/pedidos.routes';
import productosRoutes from './routes/productos.routes';
import dashboardRoutes from './routes/dashboard.routes';
import cuponesRoutes from './routes/cupones.routes';
import resenasRoutes from './routes/resenas.routes';
import configuracionRoutes from './routes/configuracion.routes';
import usuariosRoutes from './routes/usuarios.routes';
import stockRoutes from './routes/stock.routes';
import reportesRoutes from './routes/reportes.routes';
import newsletterRoutes from './routes/newsletter.routes';

// Import Error Handler
import errorHandler from './middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  // Vercel: producción (crumbskate.vercel.app) y previews por deploy
  if (process.env.NODE_ENV === 'production' && /^https:\/\/[\w.-]+\.vercel\.app$/.test(origin)) {
    return true;
  }
  return false;
}

// Middlewares de Seguridad
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS: origen no permitido (${origin})`));
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
})); // Añade cabeceras HTTP de seguridad pero permite cargar imágenes en el frontend

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 peticiones por IP cada 15 min
  message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo en 15 minutos.'
});
app.use('/api/', limiter); // Aplica el límite a todas las rutas de la API

import path from 'path';

app.use(express.json());
app.use('/', express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res, filePath) => {
    // Si el archivo no tiene extensión, forzamos un Content-Type de imagen
    // para que el navegador lo interprete correctamente a pesar del header "nosniff"
    if (!filePath.includes('.')) {
      res.set('Content-Type', 'image/jpeg');
    }
  }
}));

// Raíz y health — UptimeRobot y Render suelen pegarle a GET/HEAD /
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'CrumbSkate API',
    health: '/api/health',
  });
});

app.head('/', (_req: Request, res: Response) => {
  res.status(200).end();
});

async function healthCheck(_req: Request, res: Response) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'ok',
      message: 'Server is running and Database is connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server is running but Database connection failed',
    });
  }
}

app.get('/api/health', healthCheck);

app.head('/api/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).end();
  } catch {
    res.status(500).end();
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/cupones', cuponesRoutes);
app.use('/api/resenas', resenasRoutes);
app.use('/api/configuracion', configuracionRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Manejo centralizado de errores (debe ser el último middleware)
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
