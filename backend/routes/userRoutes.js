// routes/userRoutes.js

const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { showProfile } = require('../controllers/userController');

const router = express.Router();

router.get('/:id', authMiddleware, showProfile);

module.exports = router;