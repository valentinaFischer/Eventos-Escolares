import jsonwebtoken from 'jsonwebtoken';
const updateUserToken = async (user) => {
    try {
        return jsonwebtoken.sign({
            nome: user.nome,
            id: user.id,
            tipo_usuario: user.tipo_usuario,
            matricula: user.matricula,
            curso: user.curso,
            email: user.email 
        }, "nossosecret");
    } catch (error) {
        console.error("Erro ao gerar o token:", error); // Log de qualquer erro ao gerar o token
        throw error; // Propagar o erro para que o chamador saiba
    }
}
export default updateUserToken;