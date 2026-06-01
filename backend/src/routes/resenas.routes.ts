import { Router } from 'express';
import { listar, cambiarEstado, eliminar } from '../controllers/resenas.controller';
import { verificarToken, soloAdmin } from '../middlewares/auth';

const router = Router();

router.use(verificarToken);
router.use(soloAdmin);

router.get('/', listar);
router.put('/:id/estado', cambiarEstado);
router.delete('/:id', eliminar);

export default router;
