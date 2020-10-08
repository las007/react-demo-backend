const db = require('../config/database');

exports.getArticle = (app) => {
    console.log('log userInfo..', app.ctx.req.body, app.ctx.req.params, app.ctx.req.headers);
    console.log('log userInfo this..', this, app);
    let sql = 'select * from articles';
    db.base(sql, null, result => {
        console.log('get article msg...', result);
        app.ctx.res.send({ data: result, code: 200, msg: 'success'})
    });
};

exports.getQuestion = (req, res) => {
    console.log('log userInfo..', req.body, req.params, req.headers);
    let sql = 'select * from questions';
    db.base(sql, null, result => {
        console.log('get article msg...', result);
        res.send({ data: result, code: 200, msg: 'success'})
    });
};

exports.titleImage = (req, res) => {
    console.log('log userInfo..', req.body, req.params, req.headers);
    let sql = 'select * from articles';
    db.base(sql, null, result => {
        console.log('get article msg...', result);
        res.send({ data: result, code: 200, msg: 'success'})
    });
};

exports.testConnection = (app) => {
    console.log('log something testConn..', app.ctx.res);
    let sql = 'select * from articles';
    app.$db.base(sql, null, response => {
        console.log('get article msg...', response);
        app.ctx.res.send({ data: response, code: 200, msg: 'success'})
    });
    // app.ctx.res.send({ data: 'testConn..', code: 502, msg: 'test' });
};

/*module.exports = app => ({
    articleFunc: (req, res) => {
        console.log('log req && res...', req, res);
        console.log('log article this...', this, app);
    },
    getArticle: (ctx) => {
        console.log('log userInfo..', ctx.req.body, ctx.req.params, ctx.req.headers);
        console.log('log userInfo this..', this, app);
        let sql = 'select * from articles';
        db.base(sql, null, result => {
            console.log('get article msg...', result);
            ctx.res.send({ data: result, code: 200, msg: 'success'})
        });
    }
});*/
