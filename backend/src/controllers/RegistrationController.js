import User from '../models/User.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import { Op } from 'sequelize';


//helpers
import getToken from '../helpers/get-token.js';
import getUserByToken from '../helpers/get-user-by-token.js';
import jwt from 'jsonwebtoken';

export default class RegistrationController {
   // General functions

   static async removeRegistration(userId, eventId){
      try{
         let registration = await Registration.findOne({
            where: {
               user_id: userId,
               event_id: eventId
            }
         })
         if(!registration) return false;
         await registration.destroy();
         return true;
      } catch (err){
         console.log(err);
         throw new Error("Erro ao remover inscrição");
      }
   }


   /* 
   
   User {
      dataValues:  {
        id: 3,
        nome: 'Val',
        email: 'info2@gmail.com',
        senha: '$2b$12$ZJwVCxgOo0Xoz0/7RSPysembUYIqcK9SnfsiyXdQFJvOF3e70QXP2',
        tipo_usuario: 'admin',
        matricula: null,
        curso: null,
        createdAt: 2024-11-08T05:20:17.000Z,
        updatedAt: 2024-11-08T05:20:17.000Z
      }
   }

      Event {
        dataValues: {
          id: 1,
          nome: 'evento123',
          descricao: 'muito legal123',
          data_horario: 2024-11-07T15:23:01.000Z,
          localizacao: 'cimol',
          tipo_evento: 'nao_pago',
          publico_alvo: 'alunos_curso_especifico',
          curso_necessario: 'moveis',
          caminho_imagem: 'caminho/padrao/para/imagem.jpg',
          createdAt: 2024-11-08T04:38:59.000Z,
          updatedAt: 2024-11-08T04:38:59.000Z
        }
      }

   */

   // Event registrations
   static async cancelRegistration(req, res){
      let eventId = req.params.id;
      let token = await getToken(req);
      let user = jwt.verify(token, 'nossosecret');
      let event = await Event.findByPk(eventId);
      if(!event) return res.status(404).send("Evento não existe");
      let registration = await Registration.findOne({
         where: {
            event_id: eventId,
            user_id: user.id,
         }
      })
      if(!registration) return res.status(200).send({message: "Usuário não inscrito para o evento"});
      
      if(event.tipo == 'nao_pago' || (event.tipo == 'pago' && registration.status_pagamento == "nao_pago")){
         await registration.destroy();
         return res.send(200).send({
            "inscricao_cancelada": true,
            "message": "Inscrição cancelada com sucesso."
         })
      }
      return res.send(200).send({
         "inscricao_cancelada": false,
         "message": "Enviar mensagem a um admin para cancelar a inscrição e devolver o dinheiro.",
      });
   }

   static async newRegistration(req, res){
      let eventId = req.params.id;
      console.log(req.params);
      let token = await getToken(req);
      let user = await getUserByToken(token);
      let event = await Event.findByPk(eventId);
      if(!event) return res.status(404).send("Evento não existe");

      if((event.publico_alvo == "alunos_curso_especifico" && (user.curso == null || user.matricula == null) ) || (event.publico_alvo == "somente_alunos" && user.matricula == null))
         return res.status(403).send("Não autorizado a se inscrever neste evento");
      
      let initialStatus = event.tipo == 'pago'? 'nao_pago' : 'pago';
      let [registration, created] = await Registration.findOrCreate({
         where: {
            event_id: event.id,
            user_id: user.id
         }, 
         defaults: {
            status_pagamento: initialStatus
         }
      })
      let resBody = {
         message: created? "Inscrição feita com sucesso." : "Inscrição feita previamente",
         registration_status: registration.status_pagamento, 
      }
      return res.status(200).send(resBody);
   }

    // Admin control

    static async getRegistrationsByEventId(req, res){
      let eventId = req.params.id;

      let eventExists = await Event.findByPk(eventId, {
         attributes: ['id']
      });
      if(!eventExists) return res.status(404).send("Evento não encontrado");
      let registrations = await Registration.findAll({
          where: {
              event_id: eventId
          }
      });
      console.log(registrations);
      if(!registrations) return res.status(500).send("Erro ao carregar inscrições");
      return res.status(200).send(registrations);
   }
}