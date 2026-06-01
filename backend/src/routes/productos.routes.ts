import { Router } from 'express';
import { body } from 'express-validator';
import { listar, detalle, crear, actualizar, eliminar } from '../controllers/productos.controller';
import { verificarToken, soloAdmin } from '../middlewares/auth';
import upload from '../middlewares/upload';

const router = Router();

router.get('/', listar);
router.get('/:id', detalle);

// Rutas protegidas (solo admin)
router.use(verificarToken);
router.use(soloAdmin);

router.post(
  '/',
  upload.single('image'),
  [
    body('nombre').notEmpty().withMessage('El nombre es requerido.'),
    body('precio_base').isNumeric().withMessage('El precio debe ser número.'),
    body('categoria_id').isInt().withMessage('ID de categoría inválido.'),
  ],
  crear
);

router.put(
  '/:id',
  upload.single('image'),
  [
    body('precio_base').optional().isNumeric(),
  ],
  actualizar
);

router.delete('/:id', eliminar);

export default router;
