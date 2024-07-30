const express = require('express');
const router = express.Router();
const observeController = require('../controllers/observeController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/csv', authMiddleware, observeController.obserseCsvFile);

module.exports = router;