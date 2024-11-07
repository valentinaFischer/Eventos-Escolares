//Editar e Deletar conta estão inclusos na rota de usuário
import express from 'express';
const router = express.Router();

import AdminController from '../controllers/AdminController.js';

//Middlewares
import verifyToken from '../helpers/verify-token.js';
import verifyAdmin from '../helpers/verify-admin.js';

// Ler
router.get('/users/:id', verifyToken, verifyAdmin, AdminController.getUserById); //1 user
router.get('/users', verifyToken, verifyAdmin, AdminController.getAllUsers); //All users

// Eventos
router.post('/createEvent', verifyToken, verifyAdmin, AdminController.createEvent);

export default router;