module.exports = app => ({
    '/getUserInfo, post': () => {
        console.log('log userInfo..');
        app.$act.account.findAccount(app.ctx);
    },
    '/register, post': () => {
        console.log();
        app.$act.user.register(app.ctx);
    },
    '/info, get': () => {
        app.$act.user.getUserInfo(app.ctx);
    },
    '/writerInfo, post': () => {
       app.$act.user.writerInfo(app.ctx)
    } ,
    '/myQA, post': () => {

    },
    '/myAnswer, post': () => {

    },
    '/deleteMyArticle, post': () => {
        app.$act.user.deleteMyArticle(app.ctx);
    },
    '/createArticle, post': () => {
        app.$act.user.createArticle(app.ctx)
    }
});
