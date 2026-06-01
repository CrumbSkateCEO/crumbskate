import { Router } from 'express';
import { ventasPorDia, productosMasVendidos } from '../controllers/reportes.controller';
import { verificarToken, soloAdmin } from '../middlewares/auth';

const router = Router();

router.use(verificarToken);
router.use(soloAdmin);

router.get('/ventas-por-dia', ventasPorDia);
router.get('/productos-mas-vendidos', productosMasVendidos);

export default router;
