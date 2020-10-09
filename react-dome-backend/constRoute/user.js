module.exports = app => ({
    '/getUserInfo, post': () => {
        console.log('log userInfo..');
        app.$act.account.findAccount(app.ctx);
    },
    '/register, post': () => {
        console.log();
        app.$act.user.register(app.ctx);
    }
});
