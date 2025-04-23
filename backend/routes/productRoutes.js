// routes/productRoutes.js

const express = require('express');
const { 
    getProductById, 
    getRecommendedProducts,
    updateProductRating,
    getRecommendedProductsScorePondere,
    getProductsByPriceLessThan,
    getProductsByPriceGreaterThan, getProductsByCategory, getProductsByName,
    getAllProduct,
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/show-alls', getAllProduct);
router.get('/price-greater', getProductsByPriceGreaterThan);
router.get('/price-less', getProductsByPriceLessThan);
router.get('/category', getProductsByCategory);
router.get('/namep', getProductsByName);
router.get('/recommendations-par-score-pondere/', authMiddleware, getRecommendedProductsScorePondere);

router.get('/:id', getProductById);
router.get('/recommendations/:userId', authMiddleware, getRecommendedProducts);
router.post('/:productId/review/:userId', updateProductRating);


module.exports = router;