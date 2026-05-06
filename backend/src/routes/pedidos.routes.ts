import { Router } from 'express';
import { crear, historial, detalle } from '../controllers/pedidos.controller';
import { verificarToken } from '../middlewares/auth';

const router = Router();

router.use(verificarToken);

router.post('/', crear);
router.get('/', historial);
router.get('/:id', detalle);

export default router;
