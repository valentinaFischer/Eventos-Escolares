import { DataTypes } from 'sequelize';
import sequelize from '../db/conn.js';
import User from './User.js';
import Event from './Event.js';

const Registration = sequelize.define('Registration', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
  event_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Event,
      key: 'id',
    },
    allowNull: false,
  },
  status_pagamento: {
    type: DataTypes.ENUM('pago', 'pendente', 'nao_pago'),
    allowNull: false,
  },
});

export default Registration;