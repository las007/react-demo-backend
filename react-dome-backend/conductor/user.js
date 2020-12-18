const JWTDecode = require('jwt-decode');

module.exports = app => ({
    register: async (ctx) => {
        console.log('log user register..', ctx.req.body);

        let sql = `select * from users where name=?`;
        let data = ctx.req.body.username;
        const userInfo = await app.$connect(sql, data);
        console.log('log register user info..', userInfo);

        if ( userInfo.length > 0) {
            if (userInfo[0].name === ctx.req.body.username) {
                ctx.res.send({ code: 201, data: { text: '此用户名已被占用' }, msg: 'success'});
                const now = new Date();
                console.log('log now..', now)
            }
        }else {
            const item = ctx.req.body;
            let sql2 = `insert into users set name=?, password=?, email=?, age=?, nickName=?, phoneNumber=?, avatar_url=?, createdAt=?, updatedAt=?`;
            let data2 = [item.username, item.password, item.email, item.age, item.nickName, item.phoneNumber, item.avatar_url, new Date(), new Date()];
            const msg = await app.$connect(sql2, data2);

            console.log('log msg..', msg);
            if (msg) {
                ctx.res.send({ code: 200, data: {}, msg: 'success' })
            }
        }
    },
    getUserInfo: async (ctx) => {
        let sql = `select id, name, nickName, avatar_url, roleId from users where name=?`;

        const { username } = ctx.req.headers.token !== 'null' ? JWTDecode(ctx.req.headers.token) : {};
        if (username) {
            console.log('log user name info.', username);
            console.log('log now.', JWTDecode(ctx.req.headers.token).exp, Date.parse(new Date()) / 1000, JWTDecode(ctx.req.headers.token).exp < Date.parse(new Date()) / 1000);

            const expTime = JWTDecode(ctx.req.headers.token).exp;
            const now = Date.parse(new Date()) / 1000;
            const userInfo = await app.$connect(sql, username);
            console.log('log user register..', userInfo, userInfo.length);

            if (expTime < now) {
                ctx.res.send({ code: 301, data: '登录过期', msg: 'request' })
            } else {
                if (userInfo.length > 0) {
                    ctx.res.send({ code: 200, data: userInfo[0], msg: 'success' })
                }else {
                    ctx.res.send({ code: 501, data: {}, msg: 'fail' })
                }
            }
        } else {
            console.log('log user name info2.', username);
            ctx.res.send({ code: 333, data: {}, msg: '无操作权限' })
        }
    },
    writerInfo: async (ctx) => {
        if (ctx.req.body && ctx.req.body.id) {
            let sql = `select id, nickName, name, age, email, phoneNumber, comment_1, avatar_url, createdAt, updatedAt from users where id=?`;
            let data = ctx.req.body.id;
            const writerDetail = await app.$connect(sql, data);
            let getArticleList = `select id, title, richText, watch, isLike, imageUrl from articles where userId=?`;
            app.$db.base(getArticleList, data, result => {
                if (result.length > 0) {
                    writerDetail[0].articleList = result;
                    ctx.res.send({ code: 200, data: writerDetail, msg: 'success' })
                } else {
                    ctx.res.send({ code: 200, data: writerDetail, msg: 'success' })
                }
            });
        } else {
            ctx.res.send({ code: 501, data: {}, msg: '参数错误' })
        }
    },
    deleteMyArticle: async (ctx) => {
        console.log('log delete..', ctx.req.body, ctx.req.headers);

        const { username } = JWTDecode(ctx.req.headers.token);
        let sql = 'select * from users where name=?';
        const info = await app.$connect(sql, username);

        let sql2 = 'select * from articles where id=?';
        let data2 = ctx.req.body.id;
        app.$db.base(sql2, data2, result => {
            console.log('lgo res..', result);
            if (info[0].roleId === result[0].userId) {
                let sql3 = 'delete * articles set id=?';
                app.$connect(sql3, result[0].id)
            }
        })
    },
    createArticle: async (ctx) => {
        console.log('log article..', ctx.req.body, ctx.req.headers);

        if (ctx.req.headers && ctx.req.headers.token !== 'null') {
            let temp = ctx.req.body;

            let sql_2 = `select * from users where name=?`;
            let data_2 = [JWTDecode(ctx.req.headers.token).username];
            console.log('log user role id.', JWTDecode(ctx.req.headers.token).username, await app.$connect(sql_2, data_2));
            const userInfo = await app.$connect(sql_2, data_2);

            let sql = 'insert into articles set title=?, comment=?, imageUrl=?, richText=?, userId=?, time=?, days=?, people=?, fee=?';
            let data = [temp.articleTitle, temp.content, temp.imageUrl, temp.introduction, userInfo[0].roleId, temp.date, temp.days, temp.members, temp.outlay];

            app.$db.base(sql, data, result => {
                console.log('log add res.', result);
                if (result === undefined) {
                    ctx.res.send({ code: 200, data: {}, message: 'nothing~'})
                } else if (result.affectedRows === 1) {
                    ctx.res.send({ code: 200, data: {}, message: '保存成功' })
                }
            });
        } else {
            ctx.res.send({ code: 201, data: {}, message: '请登录！'})
        }
    }
});
