const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRouter'));
router.use('/subscribe', require('./subscribeRouter'));
router.use('/alert', require('./alertRouter'));

module.exports = router;