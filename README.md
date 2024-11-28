# Eventos-Escolares
Este projeto é um sistema web desenvolvido para facilitar o gerenciamento de eventos acadêmicos da Escola Técnica Estadual Monteiro Lobato, como palestras, workshops e seminários. A aplicação permite que administradores criem, organizem e gerenciem eventos, enquanto participantes podem se inscrever e acompanhar a programação.

# Instalação

Após clonar o repositório, instale as dependências do frontend e do backend: 

```bash
   cd frontend
   npm install
```
```bash
   cd ../backend
   npm install  
```

Crie um arquivo **.env** com os mesmos campos de **.env.example** nas pastas 'frontend' e 'backend'.

Certifique-se de que as informações colocadas no arquivo .env correspondem a um banco de dados mysql, e que esse banco esteja ativo na porta padrão (3306)

# Inicialização

### Servidor
Para inicializar o servidor:
```bash
   cd backend
   node ./index.js
```
ou em modo de desenvolvimento:
```bash
   cd backend
   npm start
```

### Cliente

Para inicializar o cliente em modo de desenvolvimento:
```bash
   cd frontend
   npm run dev
```
