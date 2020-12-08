const {
    sign,
    verify,
    forget,
    getValidateCode,
    tempCache, getHomePage,
    checkCode, resetPW } = require('./public');
const assignment = require('./public');
const { getArticle, getQuestion, titleImage, testConnection,
        getEventDetail, handleLike } = require('./article');

module.exports = {
    sign,
    verify,
    forget,
    getValidateCode,
    tempCache,
    getHomePage,
    checkCode,
    resetPW,

    assignment,

    getArticle,
    getQuestion,
    titleImage,
    testConnection,
    getEventDetail,
    handleLike
};
