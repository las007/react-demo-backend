module.exports = app => ({
    '/verification, post': async () => {
        console.log('log verification..', app);
        app.$link.checkCode(app.ctx);
        // app.$act.public.checkCode(app.ctx);
    },
    '/resetPW, post': async () => {
        console.log('log reset..');
        app.$link.assignment.resetPW(app.ctx);
    }
});
