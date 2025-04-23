// controllers/productController.js

const sparqlService = require('../services/sparqlService');
const recommenderService = require('../services/recommenderService');

const getProductById = async (req, res) => {
    const { id } = req.params;

    try {

        const results = await sparqlService.getProductById(id);

        if (results.length === 0) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }


        const product = results[0]

        res.json({
            name: product.name?.value,
            price: product.price?.value,
            image: product.image?.value,
            categoryId: product.categoryId.value || null
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du produit" });
    }
};

const getRecommendedProducts = async (req, res) => {
    const { userId } = req.params;

    try {
        // Récupération des deux types de recommandations
        const prefBased = await recommenderService.getPreferenceBasedRecommendations(userId);
        const historyBased = await recommenderService.getHistoryBasedRecommendations(userId);

        // Fusion des deux sources
        const allRecommendations = [...prefBased, ...historyBased];
        const uniqueProducts = [];
        const seenProducts = new Set();

        for (const product of allRecommendations) {
            const productUri =
                product.product?.value || product.recommendedProduct?.value;

            if (productUri && !seenProducts.has(productUri)) {
                seenProducts.add(productUri);
                uniqueProducts.push({
                    id: productUri,
                    name: product.name?.value,
                    price: product.price?.value,
                    image: product.image?.value,
                    avgRating: product.avgRating?.value || null
                });
            }
        }

        res.json(uniqueProducts.slice(0, 10));
    } catch (error) {
        console.error("Erreur dans getRecommendedProducts:", error);
        res.status(500).json({ message: "Erreur lors de la récupération des recommandations" });
    }
};


const getRecommendedProductsScorePondere = async (req, res) => {


    const userId = req.userId;

    console.log(userId);


    try {
        const hybridResults = await recommenderService.getHybridRecommendations(userId);

        res.json(hybridResults);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des recommandations hybrides" });
    }
};

const getProductsByPriceLessThan = async (req, res) => {
    const prix = parseFloat(req.query.priceL);

    try {
        const products = await sparqlService.getProductsByPriceLessThan(prix);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des produits par prix inférieur" });
    }
};

const getProductsByPriceGreaterThan = async (req, res) => {
    const prix = parseFloat(req.query.priceG);

    try {
        const products = await sparqlService.getProductsByPriceGreaterThan(prix);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des produits par prix supérieur" });
    }
};

const getProductsByName = async (req, res) => {
    const name = req.query.name?.toString() || '';

    try {
        const products = await sparqlService.getProductsByName(name);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des produits par nom" });
    }
};

const getProductsByCategory = async (req, res) => {
    const categoryId = req.query.categoryId?.toString();

    try {
        const products = await sparqlService.getProductsByCategory(categoryId);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des produits par catégorie" });
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

const getAllProduct = async (req, res) => {
    const limit = parseInt(req.query.limit) || 30;
  
    const query = `
      SELECT ?id ?name ?price ?image ?categoryId WHERE {
        ?id a ex:Product ;
            ex:productName ?name ;
            ex:price ?price ;
            ex:image ?image ;
            ex:belongsToCategory ?category .
  
        BIND(STRAFTER(STR(?category), "category_") AS ?categoryId)
      }
      LIMIT ${limit}
    `;
  
    try {
      const results = await sparqlService.selectQuery(query);
  
      const formatted = results.map(row => ({
        id: row.id.value,
        name: row.name.value,
        price: row.price.value,
        image: row.image.value,
        categoryId: row.categoryId.value
      }));
  
      res.json(formatted);
    } catch (error) {
      console.error('Erreur dans getAllProduct:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
    }
  };
  

module.exports = { 
    getProductById, 
    getRecommendedProducts, 
    getRecommendedProductsScorePondere, 
    updateProductRating, 
    getAllProduct, 
    getProductsByPriceGreaterThan, 
    getProductsByCategory, 
    getProductsByName, 
    getProductsByPriceLessThan,  
};