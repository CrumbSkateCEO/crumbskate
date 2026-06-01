import { Router } from 'express';
import { crear, historial, detalle, todos, cancelar } from '../controllers/pedidos.controller';
import { verificarToken, soloAdmin } from '../middlewares/auth';

const router = Router();

router.use(verificarToken);

router.post('/', crear);
router.get('/', historial);
router.get('/todos', soloAdmin, todos);
router.get('/:id', detalle);
router.put('/:id/cancelar', cancelar);

export default router;
