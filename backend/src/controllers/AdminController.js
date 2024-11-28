import User from '../models/User.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

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
            attributes: { exclude: ['senha'] },
        });
        const registrations = await Registration.findAll({
            where: {
                user_id: id
            },
            include: [Event] 
        })

        if(!user) {
            res.status(422).json({ message: "Usuário não encontrado." });
            return;
        }
        res.status(200).json({
            user, 
            registrations: registrations.length == 0? undefined : registrations
        });
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

    static async editEvent(req, res) {
        const id = req.params.id;

        // Check if user exists
        const token = getToken(req);
        const user = await getUserByToken(token);
        const event = Event.findByPk(id);


        if(!user) {
            res.status(422).json({ message: "Usuário não encontrado." });
            return;
        }

        // Verificar se o usuário é admin
        if (user.tipo_usuario !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado. Apenas um administrador pode editar o evento.' });
        }

        // Get body params
        const { nome, descricao, data_horario, localizacao, tipo_evento, publico_alvo} = req.body;
        let curso_necessario = null;

        // Validations
        if (!descricao || !nome || !data_horario || !localizacao || !tipo_evento || !publico_alvo) {
            res.status(422).json({ message: 'Todos os campos são obrigatórios!' });
            return;
        }

        if(publico_alvo === 'alunos_curso_especifico') {
            curso_necessario = req.body.curso_necessario;

            if (!curso_necessario) {
                res.status(422).json({ message: 'Todos os campos são obrigatórios!' });
                return;
            }
        }

        // Check if name is already registered
        const eventExists = await Event.findOne({
            where: {
                [Op.or]: [
                    { nome: nome }
                ]
            }
        });

        if(event.nome != nome && eventExists) {
            res.status(422).json({ message: "Nome de evento já cadastrado." });
            return;
        }

        // Set new values
        event.nome = nome;
        event.descricao = descricao;
        event.data_horario = data_horario;
        event.localizacao = localizacao;
        event.tipo_evento = tipo_evento;
        event.publico_alvo = publico_alvo;
        event.curso_necessario = curso_necessario;

        // Save updates
        try {
            await Event.update(
                { 
                    nome: event.nome,
                    descricao: event.descricao,
                    data_horario: event.data_horario,
                    localizacao: event.localizacao,
                    tipo_evento: event.tipo_evento,
                    publico_alvo: event.publico_alvo,
                    curso_necessario: event.curso_necessario
                },
                {
                    where: { id: id }
                }
            );
    
            // Buscar novamente o evento atualizado do banco de dados
            const updatedEvent = await Event.findOne({ where: { id: id } });
    
            if (!updatedEvent) {
                return res.status(404).json({ message: "Evento não encontrado após atualização." });
            }
    
            return res.status(200).json({ message: "Evento atualizado com sucesso!", event: updatedEvent });
            
        } catch (error) {
            res.status(500).json({ message: error });
            return;
        }
    }

    static async deleteEvent(req, res) {
        const id = req.params.id;

        // Verificar o token do usuário
        const token = getToken(req);
        const decoded = jwt.verify(token, 'nossosecret');
        const currentUser = await User.findByPk(decoded.id);

        // Verificar se o usuário existe
        if (!currentUser) {
            return res.status(422).json({ message: 'Usuário não encontrado.' });
        }

        // Verificar se o usuário é um admin
        if (currentUser.tipo_usuario !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado. Apenas um administrador podem excluir o evento.' });
        }

        // Excluir o evento
        try {
            const event = await Event.findByPk(id);
            
            if (!event) {
                return res.status(404).json({ message: 'Evento não encontrado.' });
            }

            // Deletar o evento
            await event.destroy();
            
            return res.status(200).json({ message: 'Evento excluído com sucesso.' });

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao excluir o evento. Tente novamente mais tarde.' });
        }
    }
}