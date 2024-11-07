import User from '../models/User.js';
import Event from '../models/Event.js';
import { Op } from 'sequelize';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//helpers
import createUserToken from '../helpers/create-user-token.js';
import getToken from '../helpers/get-token.js';
import getUserByToken from '../helpers/get-user-by-token.js';
import updateUserToken from '../helpers/update-user-token.js';

export default class AdminController {
    static async getUserById(req, res) {
        const id = req.params.id;

        const user = await User.findByPk(id, {
            attributes: { exclude: ['senha'] }
        });

        if(!user) {
            res.status(422).json({ message: "Usuário não encontrado." });
            return;
        }
        res.status(200).json({user});
    }

    static async getAllUsers(req, res) {
        const users = await User.findAll({
            order: [
                ['nome', 'ASC']
            ]
        });

        res.status(200).json({users: users})
    }

    static async createEvent(req, res) {
        const { nome, descricao, data_horario, localizacao, tipo_evento, publico_alvo } = req.body;

        let curso_necessario = null;
        if (publico_alvo === "alunos_curso_especifico") {
            curso_necessario = req.body.curso_necessario;
            if (!curso_necessario) {
                return res.status(422).json({ message: "O curso é obrigatório quando o público alvo é 'alunos de um curso específico'." });
            }
        }

        // Images upload

        // Validations
        if(!nome || !descricao || !data_horario || !localizacao || !tipo_evento || !publico_alvo) {
            res.status(422).json({ message: "Todos os campos são obrigatórios." });
            return;
        }

        // Create event
        try {
            const eventData = {
                nome,
                descricao,
                data_horario,
                localizacao,
                tipo_evento,
                publico_alvo,
                curso_necessario
            };
    
            if (tipo_evento === "alunos_curso_especifico") {
                const { curso_necessario } = req.body.curso_necessario;
                eventData.curso_necessario = curso_necessario;
            }    

            const event = await Event.create(eventData);

            return res.status(201).json({ message: "Evento criado com sucesso!", event });
        } catch(error) {
            return res.status(500).json({ message: "Erro ao criar evento." });
        }
    }
}