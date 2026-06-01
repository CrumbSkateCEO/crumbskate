import { Router } from 'express';
import { listarClientes, listarAdmins, cambiarRol } from '../controllers/usuarios.controller';
import { verificarToken, soloAdmin } from '../middlewares/auth';

const router = Router();

router.use(verificarToken);
router.use(soloAdmin);

router.get('/clientes', listarClientes);
router.get('/admins', listarAdmins);
router.put('/:id/rol', cambiarRol);

export default router;
