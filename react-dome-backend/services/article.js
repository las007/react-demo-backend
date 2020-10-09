const db = require('../config/database');

exports.getArticle = (app) => {
    console.log('log userInfo..', app.ctx.req.body, app.ctx.req.params, app.ctx.req.headers);
    console.log('log userInfo this..', this, app);
    // let sql = `select * from articles`;
    let sql = 'select * from users inner join articles on articles.userId=users.roleId';
    // let sql = 'select * from articles left join users on articles.userId=users.roleId';

    // let sql = `select * from articles left join users on articles.userId=users.roleId union select * from articles, users`;

    db.base(sql, null, result => {
        console.log('get article msg...', result);
        app.ctx.res.send({ data: result, code: 200, msg: 'success'})
    });
};

exports.getQuestion = (req, res) => {
    console.log('log userInfo..', req.body, req.params, req.headers);
    // let sql = 'select * from questions';
    let sql = `select * from users inner join questions on questions.userId=users.roleId`;

    db.base(sql, null, result => {
        console.log('get question msg...', result);
        /*let sql3 = `select * from question inner join users userId=roleId`;
        db.base(sql3, null, response => {
           console.log('log join..', response);
        });*/

        const id = [];
        result.forEach(d => {
           id.push(d.userId);
        });
        console.log('log result id..', id);
        let sql2 = 'select avatar_url from users where roleId in (2, 1, 3)';
        db.base(sql2, id, msg => {
            console.log('log users msg..', msg)
        });

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
