module.exports = app => ({
    createUser: (item) => {
    //已识乾坤大，犹怜草木青
        //to do...
        //connect database && do something.
        return 123
    },
    register: (ctx) => {
        console.log('log register..', ctx.req.body);
        ctx.res.send({ code: 200, data: {}, msg: 'success' })
    }
});
