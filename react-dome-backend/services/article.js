const db = require('../config/database');
const JWTDecode = require('jwt-decode');


exports.getArticle = async (app) => {
    // console.log('log userInfo..', app.ctx.req.body, app.ctx.req.params, app.ctx.req.headers);
    // console.log('log userInfo this..', this, app.ctx);
    // let sql = `select * from articles`;
    let sql = 'select users.avatar_url, users.nickName,' +
                'articles.title, articles.imageUrl, articles.richText, articles.watch, articles.isLike,' +
                'articles.id, articles.userId, articles.isPub from users join articles on articles.userId=users.roleId';
    // let sql = 'select * from articles left join users on articles.userId=users.roleId';
    // let sql = `select * from articles left join users on articles.userId=users.roleId union select * from articles, users`;

    let sql_2 = `select * from likearticles`
    const artiMsg = await app.$connect(sql_2, null);
    console.log('log arti msg.', artiMsg);

    console.log('log is like headers.',
        app.ctx.req.headers,
        app.ctx.req.headers && app.ctx.req.headers.token,
        app.ctx.req.headers && app.ctx.req.headers.token === null,
        app.ctx.req.headers && app.ctx.req.headers.token === undefined,
        Object.keys(app.ctx.req.headers && app.ctx.req.headers.token).length)

    const arr = [];
    const { username } = app.ctx.req.headers.token !== 'null' ? JWTDecode(app.ctx.req.headers.token) : {};

    if (username) {
        let sql_3 = `select id, name from users where name=?`;
        const userInfo = await app.$connect(sql_3, username);

        let sql_4 = `select * from likearticles`;
        const likeArticles = await app.$connect(sql_4, null);

        likeArticles.forEach(item => {
            if (userInfo[0].id === item.userId) {
                arr.push(item)
            }
        });
    }

    if (app.ctx.req.headers && app.ctx.req.headers.token !== 'null') {

    }
    console.log('log arti arr.', arr);

    db.base(sql, null, async result => {
        console.log('get article msg...', result);
        result.forEach((resInfo, index) => {
            resInfo.alreadyLiked = false;
            // console.log('log ind.', arr[index])
            /*if (arr[index].articleId === resInfo.id) {
                console.log('log alr.')
                resInfo.alreadyLiked = true;
            }*/
            for (let i=0;i<arr.length;i++) {
                // console.log('log alr.', i, arr[i])
                if (arr[i].articleId === resInfo.id) {
                    console.log('log alr.')
                    resInfo.alreadyLiked = true;
                }
            }
        });
        // console.log('log arti already.', result)
        app.ctx.res.send({ data: result, code: 200, msg: 'success'})
    });
};

exports.getEventDetail = async (app) => {
    let sql = `select * from articles where id=?`;
    let sql2 = `select avatar_url, nickName from users where roleId=?`;

    let sql_10 = `select id from users where name=?`;
    let currentUserInfo = [];
    if (app.ctx.req.headers.token !== 'null') {
        const username = JWTDecode(app.ctx.req.headers.token).username;
        currentUserInfo = await app.$connect(sql_10, username);
        console.log('log detail user.', currentUserInfo[0]);
    }

    app.$db.base(sql, app.ctx.req.params.eventId, async result => {
        if (result.length > 0) {
            const watch = result[0].watch || 0;

            let sql3 = `update articles set watch=? where id=?`;
            let data3 = [watch + 1, result[0].id];
            app.$connect(sql3, data3);

            const eventInfo = await app.$connect(sql2, result[0].userId);
            if (eventInfo.length > 0) {
                result[0].writer = eventInfo[0].nickName;
                result[0].avatar_url = eventInfo[0].avatar_url;
                result[0].commentList = [];

                // let sql_test = `select commentitems.id, commentitems.articleId, commentitems.userId, commentitems.liked, commentitems.comment from commentitems inner join articles on commentItems.articleId=articles.id`;
                let sql_test = `select * from commentitems where articleId=?`;
                const commentList = await app.$connect(sql_test, app.ctx.req.params.eventId);
                console.log('log comment list.', commentList);

                const promise = new Promise(function (resolve, reject) {
                    // 处理结束后，调用 resolve 或者 reject
                    console.log('log one..');
                    if (commentList.length !== 0) {
                        commentList.forEach((item, i) => {
                            console.log('log item start.', i, commentList.length, i + 1 === commentList.length, item);
                            if (item.articleId === Number(app.ctx.req.params.eventId)) {
                                console.log('log comment item.', item);
                                let sql_4 = `select avatar_url, nickName from users where id=?`;
                                let data_4 = item.userId;

                                app.$connect(sql_4, data_4).then(async tempInfo => {
                                    console.log('log temp info.', tempInfo);
                                    item.avatar_url = tempInfo[0].avatar_url;
                                    item.nickName = tempInfo[0].nickName;
                                    item.isAlreadyLiked = false;

                                    let commentInfos = [];
                                    if (currentUserInfo.length > 0) {
                                        let sql_5 = `select * from likecommentitems where commentitemId=? and userId=?`;
                                        let data_5 = [item.id, currentUserInfo[0].id];
                                        commentInfos = await app.$connect(sql_5, data_5);
                                        console.log('log com infos.', commentInfos);
                                    }

                                    if (commentInfos.length > 0) {
                                        item.isAlreadyLiked = true;
                                    }

                                    result[0].commentList.push(item);
                                    console.log('log i length.', i, commentList.length, i + 1 === commentList.length);
                                    if (i + 1 === commentList.length) {
                                        console.log('log end log.', result[0].commentList);
                                        resolve(result[0]);
                                    }
                                });
                            }
                            /*if (i + 1 === commentList.length) {
                                if (item.articleId !== Number(app.ctx.req.params.eventId)) {
                                    console.log('log no com.');
                                    resolve(result[0]);
                                }
                            }*/
                        });
                    } else {
                        // commentList.length === 0 暂无评论
                        resolve(result[0]);
                    }
                });
                promise.then(() => {
                    console.log('log comment res.', result[0]);
                    app.ctx.res.send({code: 200, data: result[0], msg: 'success'})
                });
            }else {
                app.ctx.res.send({code: 201, data: result, msg: '获取不到文章作者'})
            }
        } else {
            app.ctx.res.send({code: 501, data: {text: '获取失败'}, msg: 'fail'})
        }
    });
};

exports.handleLike = async (app) => {
    let sql = `select * from articles where id=?`;
    app.$db.base(sql, app.ctx.req.body.articleId, async articleInfo=> {
        const like = articleInfo[0].isLike || 0;
        if (app.ctx.req.headers && app.ctx.req.headers.token !== 'null') {
            const expTime = JWTDecode(app.ctx.req.headers.token).exp;
            const now = Date.parse(new Date()) / 1000;

            if (expTime < now) {
                app.ctx.res.send({ code: 301, data: '登录过期，请登录后点赞！', msg: 'request' })
            } else if (app.ctx.req.body.isLike) {
                let sql2 = `update articles set isLike=? where id=?`;
                let data2 = [like + 1, articleInfo[0].id];

                // like 是数据库关键字，直接使用会报错！！！
                // let sql4 = `insert into likearticles set articleId=?, userId=?, like=?`;
                let sql5 = `select * from likearticles where articleId=? and userId=?`;
                let data5 = [app.ctx.req.body.articleId, app.ctx.req.body.userId];
                const aid = await app.$connect(sql5, data5);
                if (aid.length !== 0) {
                    aid.forEach(async item => {
                        if (item.articleId === app.ctx.req.body.articleId) {
                            let sql3 = `update articles set isLike=? where id=?`;
                            let data3 = [articleInfo[0].isLike - 1, articleInfo[0].id];
                            app.$connect(sql3, data3);

                            let sql_4 = `delete from likearticles where articleId=? and userId=?`;
                            let data_5 = [app.ctx.req.body.articleId, app.ctx.req.body.userId];
                            app.$connect(sql_4, data_5);
                            // app.ctx.res.send({ code: 200, data: { text: '请勿重复点赞!' }, msg: 'nothing~' })
                            app.ctx.res.send({ code: 200, data: { isLike: false }, msg: 'delete' })
                        }
                    });
                } else {
                    let sql4 = `insert into likearticles set articleId=?, userId=?, liked=?`;
                    let data4 = [articleInfo[0].id, app.ctx.req.body.userId, like + 1];
                    const insertInfo = await app.$connect(sql4, data4);
                    if (insertInfo.affectedRows === 1) {
                        app.$connect(sql2, data2);
                        app.ctx.res.send({ code: 200, data: { isLike: true }, msg: 'add' })
                    }
                }
            }else {
                let sql3 = `update articles set isLike=? where id=?`;
                let data3 = [articleInfo[0].isLike - 1, articleInfo[0].id];

                let sql_4 = `delete from likearticles where articleId=? and userId=?`;
                let sql_5 = `select * from likearticles where articleId=? and userId=?`;
                let data_5 = [app.ctx.req.body.articleId, app.ctx.req.body.userId];
                const tempLike = await app.$connect(sql_4, data_5);
                console.log('log temp like.', tempLike);

                app.$connect(sql3, data3);
                app.ctx.res.send({ code: 200, data: { isLike: false }, msg: 'delete' })
            }
        } else {
            app.ctx.res.send({ code: 302, data: '暂未登录，请登录后点赞！', msg: 'request' })
        }
    });
};

exports.getQuestion = (req, res) => {
    // let sql = 'select * from questions';
    let sql = `select users.nickName, users.avatar_url, questions.id, questions.title, questions.comment, questions.userId, questions.like, questions.createdAt from users inner join questions on questions.userId=users.roleId`;

    db.base(sql, null, result => {
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
    let sql = 'select * from articles';
    db.base(sql, null, result => {
        // console.log('get article msg...', result);
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
