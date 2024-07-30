const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', authMiddleware, authController.createUser);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;