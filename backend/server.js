const express = require('express');
const app = express();
require('dotenv').config();

express.json();

app.get("/", (req, res, next) => {
   console.log("req recebida");
   return res.send("rota principal");
})

app.listen(3000, () => {
   console.log("listening");
});