// middleware/authMiddleware.js

const { verifyToken } = require('../config/auth');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Non authentifié' });
    }
    
    try {
        const decodedToken = verifyToken(token);
        //console.log(decodedToken);
        
        req.userId = decodedToken.id;

        
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token invalide' });
    }
};

module.exports = authMiddleware;
