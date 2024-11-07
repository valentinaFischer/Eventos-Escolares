import jwt from 'jsonwebtoken';
import getToken from './get-token.js';

const verifyAdmin = (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(401).json({message: "Acesso negado."});
    }

    const token = getToken(req);

    if(!token) {
        return res.status(401).json({message: "Acesso negado."});
    }

    try {
        const decoded = jwt.verify(token, 'nossosecret');
        console.log("Token decodificado:", decoded);
       // Verifica se o usuário é admin
       if (decoded.tipo_usuario !== "admin") {
            return res.status(403).json({ message: "Acesso negado! Você não é admin." });
        }

        // Armazena os dados do usuário na requisição e continua
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json({message: "Token inválido."});
    }
}

export default verifyAdmin;