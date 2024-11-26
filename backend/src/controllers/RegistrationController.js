import User from '../models/User.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import { Op } from 'sequelize';

//helpers
import getToken from '../helpers/get-token.js';
import getUserByToken from '../helpers/get-user-by-token.js';
import jwt from 'jsonwebtoken';

const SICOOB_API_PIX_URL = process.env.SICOOB_PIX_API_URL;
const SICOOB_SANDBOX_TOKEN = process.env.SICOOB_SANDBOX_TOKEN;
const SICOOB_CLIENT_ID = process.env.SICOOB_CLIENT_ID;
const CHAVE_PIX = process.env.CHAVE_PIX;
const ENVROIMENT = process.env.ENVROIMENT;

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
   static async getSicoobHeaders(){
      return {
         "client_id": SICOOB_CLIENT_ID,
         "Authorization": "Bearer "+ getSicoobToken(),
         "Content-Type": "application/json",
         "Accept": "application/json",
      }
   }
   static async getSicoobToken(){
      if(ENVROIMENT.toUpperCase() == 'DEV') return SICOOB_SANDBOX_TOKEN;
      return SICOOB_SANDBOX_TOKEN;
   }

   static async getTransaction(txid){
      return await (await fetch(SICOOB_API_PIX_URL+"/cob/"+txid, {
         method: "GET",
         headers: await this.getSicoobHeaders()
      })).json()
   }

   static async getPixQRCode(txid){
      return await (await fetch(SICOOB_API_PIX_URL+"/cob/"+txid+"/imagem", {
         method: "GET",
         headers: await this.getSicoobHeaders()
      })).json();
   }

   static async getTransactionWithQRCode(txid){
      let cobranca = await this.getTransaction(txid);
      let qrCodeImg = await this.getPixQRCode(txid);

      return {
         pix_qrcode: qrCodeImg,
         ...cobranca
      }
   }
   // Event registrations
   static async cancelRegistration(req, res){
      try{
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
         
         if(registration.status_pagamento == "nao_pago"){
            await registration.destroy();
            return res.status(200).send({message: "Inscrição cancelada com sucesso!"})
         }
         return res.status(200).send("Reembolso não implementado");
      } catch(error){
         console.log(error)
         res.sendStatus(500);
      }
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
      
      //let initialStatus = user.matricula == null? 'antesDSeraceito' : 'nao_pago'; 
      let initialStatus = "nao_pago";

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
         message: created? "Inscrição feita com sucesso!" : "Inscrição feita previamente",
         registration_status: registration.status_pagamento, 
      }
      return res.status(200).send(resBody);
   }


   // Payment handlers
   static async novoPagamento(req, res){
      let { name, personType, cpf, cnpj } = req.body;
      let { id } = req.params;

      name = name.trim();
      personType = personType.trim();
      personCode = personType == 'juridica'? cnpj.trim() : cpf.trim();
      let token = await getToken(req);

      let user = await getUserByToken(token);
      let event = await Event.findByPk(id);

      let registration = await Registration.findOne({
         where: {
            event_id: event.id,
            user_id: user.id
         }
      });

      if(!registration) return res.status(404).send("Inscrição no evento não encontrada");
      if(registration.status_pagamento == 'pendente' && registration.txid){
         let cobrancaExists = await this.getTransaction(registration.txid);
         if(cobrancaExists.status == 'ATIVA'){
            return res.status(200).send({
               "status": 200,
               "status_pagamento": "pendente",
               "chave": cobrancaExists.chave,
               "message": "Pagamento pendente",
            });
         }
      } 
      if(registration.status_pagamento == 'pendente') return res.status(200).send({
         "status": 200,
         "status_pagamento": "pendente",
         "telefone_suporte": "51 998123123",
         "message": "Pagamento pendente não registrado"
      });
      if(registration.status_pagamento == 'pago') return res.status(200).send({
         'status': 200,
         "status_pagamento": "pago",
         "message": "Entrada no evento já garantida"
      });
      if(!name) return res.status(400).send("Faltando 'name' na requisicao");
      if(personType != "juridica" && personType != "fisica") return res.status(400).send(" personType deve ser 'juridica' ou 'fisica' ");
      if(personType == 'juridica' && !cnpj) return res.status(400).send("Faltando cnpj para pessoa juridica");
      if(personType == 'fisica' && !cpf) return res.status(400).send("Faltando cpf para pessoa fisica");
      
   
      let novaCobranca = await (await fetch(SICOOB_API_PIX_URL+"/cob", {
         method: "POST",
         headers: await this.getSicoobHeaders(),
         body: JSON.stringify({
            calendario: {
               expiracao: 3600
            },
            devedor: {
               [personType == 'juridica'? 'cnpj' : 'cpf']: personCode,
               nome: name
            }, 
            valor: {
               original: event.custo_entrada,
               modalidadeAlteracao: 0,
            }, 
            chave: CHAVE_PIX,
            solicitacaoPagador: "Inscrição no evento "+event.nome,
         })
      })).json();
      // if(novaCobranca.txid) salvar no db
      if(novaCobranca.status == "ATIVA" && novaCobranca.txid){
         registration.set("status_pagamento", "pendente");
         registration.set("txid", novaCobranca.txid);
         await registration.save();
         return {
            "status": 200,
            "status_pagamento": "pendente",
            "message": "Transação criada",
            "validade": {
               ...novaCobranca.calendario,
               "expira_em": new Date((new Date(novaCobranca.calendario.criacao)).getTime()+novaCobranca.calendario.expiracao) 
            },
            "chave": novaCobranca.chave,
            "valor": novaCobranca.valor.original,
         }
      }
   }

   static async verStatusPagamento(req, res){
      let { id } = req.params;
      let token = await getToken(req);
      let user = await getUserByToken(token);

      let registration = await Registration.findOne({
         where: {
            event_id: id,
            user_id: user.id, 
         }
      });
      if(!registration.txid){
         return res.status(200).send({
            "status": 200,
            "status_pagamento": "nao_pago"
         })
      }
      let cobranca = await this.getTransactionWithQRCode(registration.txid);
      if(cobranca.status === "CONCLUIDA"){
         const reembolso = cobranca.pix.devolucoes.find(item => item.status === "EM_PROCESSAMENTO");
         if(reembolso){
            return res.status(200).send({
               "status": 200,
               "message": "Reembolso em progresso",
               "status_reembolso": cobranca.pix.devolucoes[devLength-1].status,
               "solicitado_em": cobranca.pix.devolucoes[devLength-1].horario.solicitacao
            });
         }
         return res.status(200).send({
            "status": 200,
            "status_pagamento": "pago",
            "message": "Entrada para o evento paga",
         });  
      }

      if(cobranca.status == "ATIVA"){
         return res.status(200).send({
            "status": 200,
            "status_pagamento": "pendente",
            "message": "Cobrança ativa",
            "criacao": cobranca.calendario.criacao,
            "expiracao": cobranca.calendario.expiracao,
            "pagamento": {
               "chave": cobranca.chave,
               "pix_qrcode": cobranca.pix_qrcode
            }
         });
      }
      return res.status(500).send("Erro interno");
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