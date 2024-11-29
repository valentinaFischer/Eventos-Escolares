import express from 'express';
import cors from 'cors';
import sequelize from './src/db/conn.js';

import User from './src/models/User.js';
import Event from './src/models/Event.js';
import Registration from './src/models/Registration.js';

// Relationships
User.hasMany(Registration, { foreignKey: 'user_id' });
Registration.belongsTo(User, { foreignKey: 'user_id' });

Event.hasMany(Registration, { foreignKey: 'event_id' });
Registration.belongsTo(Event, { foreignKey: 'event_id' });

const app = express();

// Config JSON response
app.use(express.json());

// Solve CORS
app.use(cors({ credentials: true, origin: ['http://localhost:3000', 'http://localhost:5173'] }));

// Public folder for images
app.use(express.static('public'));

// Routes
import UserRoutes from './src/routes/UserRoutes.js';
import AdminRoutes from './src/routes/AdminRoutes.js';
import RegistrationRoutes from './src/routes/RegistrationRoutes.js'

app.use('/users', UserRoutes);
app.use('/admin', AdminRoutes);
app.use('/events/registration', RegistrationRoutes);

// Start server
async function startServer() {
    try {
      await sequelize.authenticate();
      console.log('Conexão com o banco de dados foi bem-sucedida.');
  
      // Sincroniza todos os modelos com o banco de dados
      await sequelize.sync({ alter: true });
      console.log('Modelos sincronizados com o banco de dados.');
  
      // Inicia o servidor
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
      });
    } catch (error) {
      console.error('Erro ao conectar com o banco de dados: ', error);
    }
  }
  
startServer();