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
import Registration from '../models/Registration.js';

export default class UserController {

    static async register(req, res) {
        let { nome, email, senha, tipo_usuario, matricula, curso, confirmasenha } = req.body;
    
        // Sanitation
        nome = validator.escape(nome.trim());
        email = validator.normalizeEmail(email.trim());
        senha = senha.trim();
        tipo_usuario = tipo_usuario.trim();
        matricula = tipo_usuario === 'aluno' ? matricula.trim() : null; // Se tipo_usuario for aluno
        curso = tipo_usuario === 'aluno' ? validator.escape(curso.trim()) : null; // Se tipo_usuario for aluno
        confirmasenha = confirmasenha.trim();
    
        // Validations for all types
        if (!nome || !email || !senha || !tipo_usuario || !confirmasenha) {
            return res.status(422).json({ message: 'Todos os campos são obrigatórios!' });
        }
    
        // If the user is an 'aluno', check matrícula and curso
        if (tipo_usuario === 'aluno') {
            if (!matricula || !curso) {
                return res.status(422).json({ message: 'Matrícula e curso são obrigatórios para alunos!' });
            }
        }
    
        // Check if password and confirm password match
        if (senha !== confirmasenha) {
            return res.status(422).json({ message: 'As senhas devem ser idênticas' });
        }
    
        // Check if the user already exists
        const userExists = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email, matricula: tipo_usuario === 'aluno' ? matricula : null },
                    { email: email },
                    { matricula: tipo_usuario === 'aluno' ? matricula : null },
                ]
            }
        });
    
        // Verify email format
        if (!validator.isEmail(email)) {
            return res.status(422).json({ message: 'Email inválido' });
        }
    
        // Check if user already exists
        if (userExists) {
            if (userExists.email === email && (tipo_usuario === 'aluno' ? userExists.matricula === matricula : true)) {
                return res.status(422).json({ message: 'Email e matrícula já cadastrados' });
            } else if (userExists.email === email) {
                return res.status(422).json({ message: 'Email já cadastrado' });
            } else if (tipo_usuario === 'aluno' && userExists.matricula === matricula) {
                return res.status(422).json({ message: 'Matrícula já cadastrada' });
            }
        }
    
        // Hash the password before saving it to the database
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(senha, saltRounds);
    
        try {
            const newUser = await User.create({
                nome: nome,
                email: email,
                senha: hashedPassword,
                tipo_usuario: tipo_usuario,
                matricula: tipo_usuario === 'aluno' ? matricula : null,  // Only set matricula if the user is 'aluno'
                curso: tipo_usuario === 'aluno' ? curso : null,          // Only set curso if the user is 'aluno'
            });
    
            // Create token and send response
            await createUserToken(newUser, req, res);
            return;
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            return res.status(500).json({ message: 'Erro ao registrar usuário.' });
        }
    }
    
        
    //LOGIN
    static async login(req, res) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                res.status(422).json({ message: 'Todos os campos são obrigatórios!' });
                return;
            }

            // Checar se user já existe
            const user = await User.findOne({where: {
                [Op.or]: [
                    { email: email}, // Verifica email 
                ]
            }});

            if(!user) {
                res.status(422).json({
                    message: "Usuário não encontrado."
                });
                return;
            }

            //Validar senha
            const checkPassword = await bcrypt.compare(senha, user.senha);
            
            if(!checkPassword) {
                res.status(422).json({ message: "Senha incorreta." });
                return;
            }

            await createUserToken(user, req, res);
            return;
        } catch (error) {
            console.error("Erro no login:", error);
            res.status(500).json({ message: "Erro interno no servidor." });
        }
    }

    static async checkUser(req, res) {
        let currentUser;
        let registrations;

        if(req.headers.authorization) {
            const token = getToken(req);
            const decoded = jwt.verify(token, 'nossosecret');

            currentUser = await User.findByPk(decoded.id);
            currentUser.senha = undefined;

            registrations = await Registration.findAll({
                where: {
                    user_id: currentUser.id
                }, 
                include: [Event]
            })
            
        } else {
            currentUser = null;
        }

        return res.status(200).send({ 
            ...currentUser.dataValues,
            registrations
        });
    }

    static async editUser(req, res) {
        const id = req.params.id;

        // Check if user exists
        const token = getToken(req);
        const user = await getUserByToken(token);

        if(!user) {
            res.status(422).json({ message: "Usuário não encontrado." });
            return;
        }

        // Verificar se o usuário é o dono da conta ou um admin
        if (user.id !== parseInt(id) && user.tipo_usuario !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado. Apenas o usuário ou um administrador podem editar a conta.' });
        }

        // Get body params
        const { nome, email, tipo_usuario } = req.body;

        // Validations
        if (!email || !nome || !tipo_usuario) {
            res.status(422).json({ message: 'Todos os campos são obrigatórios!' });
            return;
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(422).json({ message: 'Email inválido.' });
        }

        // Check if email is already registered
        const userExists = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email }
                ]
            }
        });

        if(user.email != email && userExists) {
            res.status(422).json({ message: "Email já cadastrado." });
            return;
        }

        // Continue to get body params
        if(tipo_usuario === 'aluno') {
            const {matricula, curso} = req.body;

            if (!matricula || !curso) {
                res.status(422).json({ message: 'Todos os campos são obrigatórios!' });
                return;
            }

            const matriculaExists = await User.findOne({
                where: {
                    [Op.or]: [
                        { matricula: matricula }
                    ]
                }
            });

            if(user.matricula != matricula && matriculaExists) {
                res.status(422).json({ message: "Matrícula já cadastrada." });
                return;
            }

            user.matricula = matricula;
            user.curso = curso;
        } 

        // Set new values
        user.nome = nome;
        user.email = email;
        user.tipo_usuario = tipo_usuario;

        // Save updates
        try {
            await User.update(
                { 
                    nome: user.nome,
                    email: user.email,
                    tipo_usuario: user.tipo_usuario,
                    matricula: user.matricula,
                    curso: user.curso
                },
                {
                    where: { id: id }
                }
            );
    
            // Buscar novamente o usuário atualizado do banco de dados
            const updatedUser = await User.findOne({ where: { id: id } });
    
            if (!updatedUser) {
                return res.status(404).json({ message: "Usuário não encontrado após atualização." });
            }
    
            // Gere o novo token usando o usuário atualizado
            const newToken = await updateUserToken(updatedUser);
    
            // Envie a resposta com o novo token e o usuário atualizado
            return res.status(200).json({ message: "Perfil atualizado com sucesso!", user: updatedUser, token: newToken });
            
        } catch (error) {
            res.status(500).json({ message: error });
            return;
        }
    }

    static async deleteUser(req, res) {
        const id = req.params.id;

        // Verificar o token do usuário
        const token = getToken(req);
        const decoded = jwt.verify(token, 'nossosecret');
        const currentUser = await User.findByPk(decoded.id);

        // Verificar se o usuário existe
        if (!currentUser) {
            return res.status(422).json({ message: 'Usuário não encontrado.' });
        }

        // Verificar se o usuário é o dono da conta ou um admin
        if (currentUser.id !== parseInt(id) && currentUser.tipo_usuario !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado. Apenas o usuário ou um administrador podem excluir a conta.' });
        }

        // Excluir o usuário
        try {
            const user = await User.findByPk(id);
            
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }

            // Deletar o usuário
            await user.destroy();
            
            return res.status(200).json({ message: 'Conta excluída com sucesso.' });

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao excluir a conta. Tente novamente mais tarde.' });
        }
    }

    static async getEventosByUserType(req, res) {
        try {
            // Verificar o token do usuário
            const token = getToken(req);
            const decoded = jwt.verify(token, 'nossosecret');
            const currentUser = await User.findByPk(decoded.id);
            // Get user data
            const userType = currentUser.tipo_usuario; 
            const userCourse = currentUser.curso; 
            let whereCondition = {};
    
            // Filtrar eventos com base no público-alvo e tipo de usuário
            switch(userType) {
                case 'admin':
                    // Admin vê todos os eventos
                    whereCondition = {};
                    break;
                case 'aluno':
                    if (userCourse) {
                        // Aluno vê eventos "todos" e "alunos_curso_especifico" com o curso correspondente
                        whereCondition = {
                            [Op.or]: [
                                { publico_alvo: 'todos' },
                                { publico_alvo: 'alunos_curso_especifico', curso_necessario: userCourse }
                            ]
                        };
                    } else {
                        // Aluno sem curso vê apenas eventos "todos" e "somente_alunos"
                        whereCondition = {
                            [Op.or]: [
                                { publico_alvo: 'todos' },
                                { publico_alvo: 'somente_alunos' }
                            ]
                        };
                    }
                    break;
                case 'visitante':
                    // Visitante vê apenas eventos "todos"
                    whereCondition = { publico_alvo: 'todos' };
                    break;
                default:
                    return res.status(400).json({ message: "Tipo de usuário inválido." });
            }
    
            // Buscar os eventos com base na condição filtrada
            const eventos = await Event.findAll({
                where: whereCondition,
                order: [['data_horario', 'ASC']]  // Ordenar por data
            });
    
            if (eventos.length === 0) {
                return res.status(404).json({ message: "Nenhum evento encontrado para este usuário." });
            }
    
            return res.status(200).json({ eventos });
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
            return res.status(500).json({ message: "Erro ao buscar eventos." });
        }
    }
}