module.exports = app => ({
    '/findAnswer, post': () => {
        // this.$router.post()
        this.$services.sign();
    },
    '/getTempCache, get': (req, res) =>   {
        console.log('log temp this//', app);
        // this.$services.tempCache();
        // console.log('log type2..', typeof app.$link.getArticle);

        // await app.$act.account.createAccount(app.ctx);
        app.$link.getArticle(app);
        // app.ctx.res.send({ code: 200, msg: 'success', data: {text: '退出成功' }});
/*
        res.send({ data: 'connecting..', code: 502, msg: 'test' })
*/
        // app.$services.tempCache(app.ctx);
    },
    '/getEventDetail/:eventId, get':  () => {
        app.$link.getEventDetail(app);
    },
    '/like, post': () => {
        app.$link.handleLike(app);
    }
});
/*
console.log('log this////', this);
// this.$router.get('/public/getTempCache', this.$services.tempCache);
// module.exports = this.$router;

module.exports = app => console.log('log app..', app, this);
*/
