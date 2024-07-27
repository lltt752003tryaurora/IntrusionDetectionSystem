const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.post('/alert', alertController.sendAlertEmail);

module.exports = router;