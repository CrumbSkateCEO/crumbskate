import { Router } from 'express';
import { listar, crear, actualizar, eliminar, validar } from '../controllers/cupones.controller';
import { verificarToken, soloAdmin } from '../middlewares/auth';

const router = Router();

// Ruta pública para validar un cupón en el checkout
router.post('/validar', validar);

// Todas las rutas de cupones requieren ser admin por ahora
router.use(verificarToken);
router.use(soloAdmin);

router.get('/', listar);
router.post('/', crear);
router.put('/:id', actualizar);
router.delete('/:id', eliminar);

export default router;
