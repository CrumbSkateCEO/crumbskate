import { Router } from 'express';
import { listar, actualizar } from '../controllers/stock.controller';
import { verificarToken, soloAdmin } from '../middlewares/auth';

const router = Router();

router.use(verificarToken);
router.use(soloAdmin);

router.get('/', listar);
router.put('/:id', actualizar);

export default router;
