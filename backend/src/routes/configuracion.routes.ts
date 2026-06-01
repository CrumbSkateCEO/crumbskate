import { Router } from 'express';
import { listar, actualizar } from '../controllers/configuracion.controller';
import { verificarToken, soloAdmin } from '../middlewares/auth';

const router = Router();

// GET es publico si el frontend necesita configuraciones como costo de envío sin estar logueado
router.get('/', listar);

router.use(verificarToken);
router.use(soloAdmin);
router.put('/', actualizar);

export default router;
