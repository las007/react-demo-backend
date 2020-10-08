module.exports = app => ({
    /*createAccount:(req, res) => {
        console.log('log createAccount msg...', req.body, req.params);
        res.send({ data: 'create', code: 200, msg: 'success' })
    },*/
    createAccount: async (ctx) => {
        console.log('log createAccount msg...', ctx.req.body, ctx.req.params);
        console.log('log account this..', this, app);
        ctx.res.send({ data: 'create', code: 200, msg: 'success' })
    },
    findAccount: (ctx) =>{
        console.log('log conductor account..');
        ctx.res.send({ data: 'sending..', code: 200, msg: 'success' })
    },
    updateAccount: (ctx) => {
        ctx.res.send({ data: 'something', code: 200, msg: 'success' })
    },
    deleteAccount: (req, res) => {
        console.log('log delete this..', req, res);
    }
});

/*
exports.createAccount = (ctx) => {
    console.log('log createAccount msg...', ctx.req.body, ctx.req.params);
    ctx.res.send({ data: 'create', code: 200, msg: 'success' })
};
*/
