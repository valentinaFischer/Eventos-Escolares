import jsonwebtoken from 'jsonwebtoken';

const createUserToken = async(user, req, res) => {
    const token = jsonwebtoken.sign({
        nome: user.nome,
        id: user.id,
        tipo_usuario: user.tipo_usuario,
        matricula: user.matricula,
        curso: user.curso,
        email: user.email 
    }, "nossosecret");

    // Return token
    res.status(200).json({
        message: "Você está logado(a)",
        token: token,
        user: {
            nome: user.nome,
            id: user.id,
            tipo_usuario: user.tipo_usuario,
            matricula: user.matricula,
            curso: user.curso,
            email: user.email 
        }
    });
} 

export default createUserToken;