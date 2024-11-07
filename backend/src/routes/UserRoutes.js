import express from 'express';
const router = express.Router();

import UserController from '../controllers/UserController.js';

//Middlewares
import verifyToken from '../helpers/verify-token.js';

//Entrar
router.post('/register', UserController.register);
router.post('/login', UserController.login);

//Ler
router.get('/me', verifyToken, UserController.checkUser);
router.get('/eventos', verifyToken, UserController.getEventosByUserType);

//Editar
router.patch('/edit/:id', verifyToken, UserController.editUser);

//Deletar
router.delete('/delete/:id', verifyToken, UserController.deleteUser);

export default router;