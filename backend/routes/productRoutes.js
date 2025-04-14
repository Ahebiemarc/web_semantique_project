// routes/productRoutes.js

const express = require('express');
const { 
    getProductById, 
    getRecommendedProducts,
    updateProductRating
} = require('../controllers/productController');

const router = express.Router();

router.get('/:id', getProductById);
router.get('/recommendations/:userId', getRecommendedProducts);
router.post('/:productId/review/:userId', updateProductRating);

module.exports = router;