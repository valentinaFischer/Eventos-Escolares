import { DataTypes } from 'sequelize';
import sequelize from '../db/conn.js';

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  data_horario: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  localizacao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo_evento: {
    type: DataTypes.ENUM('pago', 'nao_pago'),
    allowNull: false,
  },
  publico_alvo: {
    type: DataTypes.ENUM('todos', 'somente_alunos', 'alunos_curso_especifico'),
    allowNull: false,
  },
  curso_necessario: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  caminho_imagem: {
    type: DataTypes.STRING,
    defaultValue: 'caminho/padrao/para/imagem.jpg', // Valor padrão
  },
});

export default Event;