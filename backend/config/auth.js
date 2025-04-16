// config/auth.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateTokenAndCookie = (userId) => {
    // ✅ Générer le token JWT

    const age = 1000 * 60 * 60 * 24 * 7; // a one week

    const token = jwt.sign({id: user.id, role}, process.env.JWT_SECRET_KEY, {expiresIn: age});


    // ✅ Définir le cookie sécurisé
    res.cookie('token', token, {
      httpOnly: true,
      //secure: process.env.NODE_ENV === 'production', // true en production
      //sameSite: 'strict',
      maxAge: age
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateTokenAndCookie, verifyToken };