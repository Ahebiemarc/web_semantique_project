// middleware/authMiddleware.js

const { verifyToken } = require('../config/auth');

const authMiddleware = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'Non authentifié' });
    }
    
    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = verifyToken(token);
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token invalide' });
    }
};

module.exports = authMiddleware;