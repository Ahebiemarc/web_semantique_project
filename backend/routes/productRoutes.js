// routes/productRoutes.js

const express = require('express');
const { 
    getProductById, 
    getRecommendedProducts,
    updateProductRating,
    getRecommendedProductsScorePondere,
} = require('../controllers/productController');

const router = express.Router();

router.get('/:id', getProductById);
router.get('/recommendations/:userId', getRecommendedProducts);
router.get('/recommendations-par-score-pondere/:userId', getRecommendedProductsScorePondere);
router.post('/:productId/review/:userId', updateProductRating);

module.exports = router;