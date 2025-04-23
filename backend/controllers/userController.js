// controllers/userController.js

const sparqlService = require('../services/sparqlService');


const showProfile = async (req, res) => {

    const id = req.userId
    try {
        const user = await sparqlService.getUserById(id);

        //const userId = req.userId;

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json({
            id,
            username: user.username.value,
            email: user.email.value
        });
    } catch (error) {
        console.error("Erreur showProfile:", error);
        res.status(500).json({ message: 'Erreur lors de la récupération du profil utilisateur' });
    }
};


module.exports = {
    showProfile
}