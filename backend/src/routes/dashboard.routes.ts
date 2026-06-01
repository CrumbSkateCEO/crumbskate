import { Router } from 'express';
import { getStats } from '../controllers/dashboard.controller';
import { verificarToken, soloAdmin } from '../middlewares/auth';

const router = Router();

router.use(verificarToken);
router.use(soloAdmin);

router.get('/stats', getStats);

export default router;
