const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const subscribeController = require('../controllers/subscribeController');

router.post('/register', authMiddleware, subscribeController.registerSubscriber);

module.exports = router;