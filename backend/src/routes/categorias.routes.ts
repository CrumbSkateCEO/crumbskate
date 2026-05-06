import { Router } from 'express';
import { listar, crear } from '../controllers/categorias.controller';

const router = Router();

router.get('/', listar);
router.post('/', crear); // (solo admin) Nota: no hay middleware en la ruta original, se podría agregar

export default router;
