module.exports = app => ({
    addComment: async (ctx) => {
      console.log('log comment.', ctx.req.body);

      let sql = `insert into commentItems set articleId=?, userId=?, comment=?, liked=?`;
      let data = [ctx.req.body.articleId, ctx.req.body.userId, ctx.req.body.comment, null];

      const createMsg = await app.$connect(sql, data);
      console.log('log comment msg.', createMsg);

      if (createMsg.affectedRows === 1) {

      }
      ctx.res.send({ code: 200, data: {}, message: "success" })
    },
    isLikeComment: async (ctx) => {
        console.log('log is like com.', ctx.req.body, ctx.req.body.id);
        // const userInfo = await app.$act.checkusers.isCheckUsers(ctx.req.body.userId);
        let sql_0 = `select id, nickName, name, avatar_url from users where id=?`;
        const userInfo = await app.$connect(sql_0, ctx.req.body.userId);
        console.log('log is like user.', userInfo);

        if (userInfo[0].id) {
            let sql_1 = 'select * from commentitems where id=?';
            app.$db.base(sql_1, ctx.req.body.id, result => {
                console.log('log like com.', result);
                if (result[0].id) {
                    const like = result[0].liked || 0;
                    if (ctx.req.body.isLiked) {
                        let sql_2 = `update commentitems set liked=? where id=?`;
                        let data_2 = [like + 1, result[0].id];

                        let sql_3 = `insert into likecommentitems set commentitemId=?, userId=?, liked=?`;
                        let data_3 = [result[0].id, ctx.req.body.userId, like + 1];

                        let sql_4 = `select * from likecommentitems where commentitemId=? and userId=?`;
                        let data_4 = [result[0].id, ctx.req.body.userId];

                        // let sql_5 = `update likecommentitems set liked=? where commentitemId=?`;
                        let sql_5 = `delete from likecommentitems where commentitemId=? and userId=?`;
                        let data_5 = [result[0].id, ctx.req.body.userId];

                        let sql_6 = `update commentitems set liked=? where id=?`;
                        let data_6 = [like - 1, result[0].id];

                        app.$connect(sql_4, data_4).then(fourthData => {
                            console.log('log fourth data.', fourthData);
                            if (fourthData.length > 0) {
                                app.$connect(sql_5, data_5).then(thirdData => {
                                    if (thirdData.affectedRows === 1) {
                                        app.$connect(sql_6, data_6).then(resInfo => {
                                            console.log('log suc like.', resInfo);
                                            if (resInfo.affectedRows === 1) {
                                                ctx.res.send({ code: 200, data: { text: 'create' }, message: 'success' });
                                            }
                                        });
                                        // ctx.res.send({ code: 200, data: { text: 'update' }, message: 'success' });
                                    }
                                });
                            } else {
                                app.$connect(sql_3, data_3).then(thirdData => {
                                    if (thirdData.affectedRows === 1) {
                                        app.$connect(sql_2, data_2).then(resInfo => {
                                            console.log('log suc like.', resInfo);
                                            if (resInfo.affectedRows === 1) {
                                                ctx.res.send({ code: 200, data: { text: 'create' }, message: 'success' });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                } else {
                    let sql = `insert into likecommentitems set commentitemId=?, userId=?, liked=?`;
                    let data = [];
                }
            });
        } else {
            ctx.res.send({ code: 200, data: { text: '用户未登录！' }, message: 'fail' });
        }
    }
});
