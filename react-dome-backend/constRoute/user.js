module.exports = app => ({
    '/getUserInfo, post': () => {
        console.log('log userInfo..');
        app.$act.account.findAccount(app.ctx);
    }
});
