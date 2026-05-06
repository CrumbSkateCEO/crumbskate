import { Router } from 'express';
import { ver, agregar, eliminarItem, vaciar } from '../controllers/carrito.controller';
import { verificarToken } from '../middlewares/auth';

const router = Router();

// Todas las rutas del carrito requieren estar autenticado
router.use(verificarToken);

router.get('/', ver);
router.post('/agregar', agregar);
router.delete('/item/:itemId', eliminarItem);
router.delete('/vaciar', vaciar);

export default router;
