//Editar e Deletar conta estão inclusos na rota de usuário
import express from 'express';
const router = express.Router();

import RegistrationController from '../controllers/RegistrationController.js';

//Middlewares
import verifyToken from '../helpers/verify-token.js';

// Open an registration
router.put("/:id", RegistrationController.newRegistration);

// Cancel registration
router.delete("/:id", RegistrationController.cancelRegistration);


export default router;