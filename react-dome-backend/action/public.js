module.exports = app => ({
    checkCode: (ctx) => {
        console.log('log check code2..', ctx.req.body);
        ctx.res.send({ data: 'nothing...', code: 500, msg: 'testing' })
    }
});
