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
        let sql = `select id, name, nickName, avatar_url from users where name=?`;
        let data = JWTDecode(ctx.req.headers.token).username;
        const userInfo = await app.$connect(sql, data);
        console.log('log user register..', userInfo, userInfo.length);
        if (userInfo.length > 0) {
            ctx.res.send({ code: 200, data: userInfo[0], msg: 'success' })
        }else {
            ctx.res.send({ code: 501, data: {}, msg: 'fail' })
        }
    }
});
