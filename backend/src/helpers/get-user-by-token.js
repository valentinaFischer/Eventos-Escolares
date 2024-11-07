import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const getUserByToken = async(token) => {
    if(!token) {
        return resizeBy.status(401).json({ message: "Acesso negado." });
    }
    const decoded = jwt.verify(token, 'nossosecret');
    const userId = decoded.id;

    const user = await User.findByPk(userId);
    return user;
}

export default getUserByToken;