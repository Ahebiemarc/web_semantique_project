// config/auth.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (userId) => {
    // ✅ Générer le token JWT

    const age = 1000 * 60 * 60 * 24 * 7; // a one week

    const token = jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: age});

    return token;
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };