// controllers/productController.js

const sparqlService = require('../services/sparqlService');
const recommenderService = require('../services/recommenderService');

const getProductById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const query = `
        SELECT ?name ?price ?image ?description ?categoryName WHERE {
            ex:product_${id} ex:productName ?name ;
                             ex:price ?price ;
                             ex:image ?image ;
                             ex:description ?description ;
                             ex:belongsToCategory ?category .
            ?category ex:categoryName ?categoryName .
        }
        `;
        
        const results = await sparqlService.selectQuery(query);
        
        if (results.length === 0) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        
        res.json(results[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du produit" });
    }
};

const getRecommendedProducts = async (req, res) => {
    const { userId } = req.params;
    
    try {
        // Combiner les recommandations basées sur les préférences et l'historique
        const prefBased = await recommenderService.getPreferenceBasedRecommendations(userId);
        const historyBased = await recommenderService.getHistoryBasedRecommendations(userId);
        
        // Fusionner et dédupliquer les résultats
        const allRecommendations = [...prefBased, ...historyBased];
        const uniqueProducts = [];
        const seenProducts = new Set();
        
        for (const product of allRecommendations) {
            if (!seenProducts.has(product.product.value)) {
                seenProducts.add(product.product.value);
                uniqueProducts.push(product);
            }
        }
        
        res.json(uniqueProducts.slice(0, 10));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des recommandations" });
    }
};

const updateProductRating = async (req, res) => {
    const { userId, productId } = req.params;
    const { rating, reviewText } = req.body;
    
    try {
        const reviewId = Date.now();
        const now = new Date().toISOString().split('T')[0];
        
        const query = `
        INSERT DATA {
            ex:review_${reviewId} rdf:type ex:Review ;
                                 ex:rating ${rating} ;
                                 ex:reviewDate "${now}"^^xsd:date ;
                                 ex:reviewedProduct ex:product_${productId} .
            
            ex:user_${userId} ex:hasReview ex:review_${reviewId} .
            
            ${reviewText ? `ex:review_${reviewId} ex:reviewText "${reviewText}" .` : ''}
        }
        `;
        
        await sparqlService.updateQuery(query);
        
        res.json({ message: "Avis enregistré avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'enregistrement de l'avis" });
    }
};

module.exports = { getProductById, getRecommendedProducts, updateProductRating };