module.exports = app => ({
    register: (ctx) => {
        console.log('log user register..', ctx.req.body);
        ctx.res.send({ data: { text: 'testing', code: 999, msg: 'nothing' }})
    }
});
