const express = require('express');
const router = express.Router();
const services = require('../services/index');

router.get('/user/getUserInfo', services.userInfo);

module.exports = router;
