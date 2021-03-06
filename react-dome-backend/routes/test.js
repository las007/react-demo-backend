const express = require('express');
const router = express.Router();
const services = require('../services/test');
const connect = require('../services');
const section = require('../services/section');
const conductors = require('../conductor');
const { uploadFunc } = require('../action/upload');


router.get('/user/getUserInfo', services.userInfo);
router.get('/public/getPublicKey', services.getPublicKey);

//subLogin
router.post('/user/subLogin', services.subLogin);
router.get('/user/logout', services.logout);
router.post('/user/tempCache', connect.tempCache);
router.post('/user/register', services.register);

router.get('/public/test', services.test);
router.get('/public/captcha', services.getCaptcha);
router.get('/public/getToken', connect.sign);
router.get('/public/verify', connect.verify);
router.post('/public/forget', connect.forget);
router.get('/public/getValue', connect.getValidateCode);
router.get('/public/getHomePage', connect.getHomePage);
// router.get('/test/getCtrl', this.$act.account.createAccount);

//testing
router.get('/test/conductors/testFunc', conductors.test(this).testFunc);
console.log('log router something..', this.$act);
console.log('log conductors..', conductors.test(this).testFunc);
// router.get('/test/didRoute/:msg',services.didTesting);
router.get('/test/didRoute/avatar/:msg',services.didTesting);

// router.post('/section/uploadImage', section.uploadImage);
router.post('/section/uploadImage', uploadFunc);


//获取首页信息
router.get('/public/getArticle', connect.getArticle);
router.get('/public/getQuestion', connect.getQuestion);
router.get('/public/question/getQuestion', connect.titleImage);

module.exports = router;
// module.exports = app => ({
//     router
// });
