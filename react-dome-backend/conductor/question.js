module.exports = app => ({
    createQuestion: (ctx) => {
        console.log('log createQA..', ctx.res.body);

        ctx.res.send({ data: { text: 'connection'}, code: 200, msg: 'success' })
    },
    findQuestion: (ctx) => {
        console.log('log findQuestion..', ctx.req.body, ctx.req.params);

        // let sql = `select * from questions where id=?`;
        let sql = `select * from questions inner join users on questions.userId=users.roleId`;
        let data = ctx.req.body.id;
        app.$db.base(sql, data, message => {
            console.log('log qa msg..', message);
            ctx.res.send({ data: message, code: 200, msg: 'success' })
        });
    },
    deleteQA: (ctx) => {
        console.log('log deleteQA..', ctx.res.body);

        ctx.res.send({ data: { text: 'connection'}, code: 200, msg: 'success' })
    },
    editQA: (ctx) => {
        console.log('log editQA..', ctx.res.body);

        ctx.res.send({ data: { text: 'connection'}, code: 200, msg: 'success' })
    },
    getMyQuestion: (ctx) => {
        console.log('log getMyQuestion..', ctx.res.body);

        ctx.res.send({ data: { text: 'connection'}, code: 200, msg: 'success' })
    },
    praiseQuestion: (ctx) => {
        console.log('log praiseQuestion..', ctx.res.body);

        ctx.res.send({ data: { text: 'connection'}, code: 200, msg: 'success' })
    }
});
