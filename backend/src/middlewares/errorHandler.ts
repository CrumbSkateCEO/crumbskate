import { Request, Response, NextFunction } from 'express';

// Manejo centralizado de errores
// Se usa como último middleware en server.js / index.ts
export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // Error de validación de express-validator
  if (err.type === 'validation') {
    return res.status(400).json({ error: err.message });
  }

  // Error de duplicado en MySQL (código 1062)
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'Ya existe un registro con ese valor.' });
  }

  // Error genérico - en producción no exponemos detalles internos
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor.'
      : err.message;

  res.status(statusCode).json({ error: message });
}
