import { DataTypes } from 'sequelize';
import sequelize from '../db/conn.js';
import bcrypt from 'bcrypt';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo_usuario: {
    type: DataTypes.ENUM('admin', 'aluno', 'visitante'),
    defaultValue: 'visitante',
  },
  matricula: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  curso: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Método para verificar a senha usando bcrypt de forma assíncrona
User.prototype.verifyPassword = async function(password) {
  return await bcrypt.compare(password, this.senha);
};

export default User;