const express = require('express');
const router = express.Router();
const services = require('../services/test');
const connect = require('../services');

router.get('/user/getUserInfo', services.userInfo);
router.get('/public/getPublicKey', services.getPublicKey);

//subLogin
router.post('/user/subLogin', services.subLogin);
router.get('/public/test', services.test);
router.get('/public/captcha', services.getCaptcha);
router.get('/public/getToken', connect.sign);
router.get('/public/verify', connect.verify);

module.exports = router;
