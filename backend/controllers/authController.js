// controllers/authController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sparqlService = require('../services/sparqlService');
const { generateToken } = require('../config/auth');
require('dotenv').config();

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const query = `
            SELECT ?id ?username ?password ?email  WHERE {
            ?id a ex:User ;
                ex:username "${username}" ;
                ex:password ?password ;
                ex:email ?email ;
                ex:username ?username .
            }
            `;


        const results = await sparqlService.selectQuery(query);

        if (results.length === 0) {
            return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
        }

        const user = results[0];
        //const passwordMatch = await bcrypt.compare(password, user.password.value);

        if (password !== user.password.value) {
            return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
        }

        const userId = user.id.value.split('_')[1]; // ex: ex:user_15 → "15"
        const token = generateToken(userId);

        // ✅ Définir le cookie sécurisé
        const age = 1000 * 60 * 60 * 24 * 7; // a one week

        res.cookie('token', token, {
            httpOnly: true,
            //secure: process.env.NODE_ENV === 'production', // true en production
            //sameSite: 'strict',
            maxAge: age
        });

        // ✅ Renvoi des données utilisateur
        res.json({
            id: userId,
            username: user.username.value,
            email: user.email.value,
            token,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'authentification" });
    }
};


const register = async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        // Vérifier si l'utilisateur existe déjà
        const checkQuery = `
        ASK {
            ?user ex:username "${username}" .
        }
        `;
        
        const userExists = await sparqlService.selectQuery(checkQuery);
        
        if (userExists) {
            return res.status(400).json({ message: "Nom d'utilisateur déjà utilisé" });
        }
        
        // Hacher le mot de passe
       // const hashedPassword = await bcrypt.hash(password, 12);
        
        // Créer l'utilisateur
        const userId = await sparqlService.createUser({
            username,
            email,
            password: password
        });
        
        
        res.status(201).json({ userId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'inscription" });
    }
};


const logout = (req, res) =>{
    // Code to log out a user goes here
    res.clearCookie("token").status(200).json({message: "Logout successful"})
}

module.exports = { login, register, logout };