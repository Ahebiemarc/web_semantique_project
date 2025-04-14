// controllers/authController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sparqlService = require('../services/sparqlService');
const { generateToken } = require('../config/auth');
require('dotenv').config();

const login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Recherche de l'utilisateur
        const query = `
        SELECT ?userId ?password WHERE {
            ?userId ex:username "${username}" ;
                   ex:password ?password .
        }
        `;
        
        const results = await sparqlService.selectQuery(query);
        
        if (results.length === 0) {
            return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
        }
        
        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password.value);
        
        if (!passwordMatch) {
            return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
        }
        
        // Création du token JWT
        const userId = user.userId.value.split('_')[1];
        const token = generateToken(userId);
        
        res.json({ token, userId });
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
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Créer l'utilisateur
        const userId = await sparqlService.createUser({
            username,
            email,
            password: hashedPassword
        });
        
        // Générer le token
        const token = jwt.sign(
            { userId },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        res.status(201).json({ token, userId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'inscription" });
    }
};

module.exports = { login, register };