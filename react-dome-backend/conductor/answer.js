const JWTDecode = require('jwt-decode');

module.exports = app => ({
    getAnswerList: async (ctx) => {
        // let sql = `select * from answer where questionId=?`;
        let sql = `select users.nickName, users.avatar_url,
                    answer.id, answer.questionId, answer.isAnswer, answer.liked, answer.userId, answer.content, answer.createdAt 
                    from users right join answer on users.id=answer.userId`;
        let sql_0 = `select * from answer where questionId=?`;
        const answerData = await app.$connect(sql_0, ctx.req.query.questionId);
        const { id } = ctx.req.headers.token !== 'null' ? JWTDecode(ctx.req.headers.token) : {};
        app.$connect(sql, null).then(item => {
            let result = [];

            if (answerData.length > 0) {
                const promise = new Promise(resolve => {
                    if (item.length !== 0) {
                        item.forEach((d, i) =>  {
                            d.isAlreadyLiked = false;
                            if (d.questionId === Number(ctx.req.query.questionId)) {
                                let sql_0 = `select * from likeanswer where answerId=? and userId=?`;
                                let data_0 = [d.id, id];
                                app.$connect(sql_0, data_0).then(resInfo => {
                                    if (resInfo.length > 0) {
                                        d.isAlreadyLiked = true;
                                    }
                                    result.push(d);
                                    if (i + 1 === answerData.length) {
                                        resolve(result);
                                    }
                                });
                            }
                        });
                    } else {
                        resolve(result);
                    }
                });
                promise.then(() => {
                    ctx.res.send({ code: 200, data: result, message: 'success' })
                });

            } else {
                ctx.res.send({ code: 333, data: '系统内部错误，未找到数据', message: 'fail' })
            }
        })
    },
    pubAnswerContent: (ctx) =>{
        console.log('log pub an.', ctx.req.body, ctx.req.params, ctx.req.query);

        let sql = `insert into answer set questionId=?, isAnswer=?, userId=?, content=?, liked=?, createdAt=?`;
        let data = [ctx.req.body.questionId, 0, ctx.req.body.userId, ctx.req.body.content, 0, new Date()];
        app.$connect(sql, data).then(result => {
            console.log('log is pub an.', result);
            if (result.affectedRows === 1) {
                ctx.res.send({ code: 200, data: result, message: 'success' })
            } else {
                ctx.res.send({ code: 333, data: '系统内部错误', message: 'fail' })
            }
        })
    },
    answerLike: async (ctx) => {
        console.log('log ctx an like.', ctx.req.body, ctx.req.params, ctx.req.query);

        const { id, username } = ctx.req.headers.token !== 'null' ? JWTDecode(ctx.req.headers.token) : {};
        console.log('log like answer.', id, username);

        let sql_0 = `select * from users where id=?`;
        const userInfo = await app.$connect(sql_0, ctx.req.body.userId);
        if (userInfo[0].id) {
            console.log('log an like user.');
            let sql_1 = `select * from answer where id=?`;
            app.$db.base(sql_1, ctx.req.body.id, result => {
               const like = Number(result[0].liked) || 0;

               console.log('log answer like of type.', like, typeof like);
               if (ctx.req.body.isLiked) {
                   let sql_2 = `insert into likeanswer set answerId=?, userId=?, liked=?`;
                   let data_2 = [ctx.req.body.id, ctx.req.body.userId, like + 1];

                   let sql_3 = `select * from likeanswer where answerId=? and userId=?`;
                   let data_3 = [result[0].id, ctx.req.body.userId];

                   let sql_4 = `delete from likeanswer where answerId=? and userId=?`;
                   let data_4 = [result[0].id, ctx.req.body.userId];

                   let sql_5 = `update answer set liked=? where id=?`;
                   let data_5 = [like + 1, result[0].id];

                   let sql_6 = 'update answer set liked=? where id=?';
                   let data_6 = [like - 1, result[0].id];

                   app.$connect(sql_3, data_3).then(thirdInfo => {
                       console.log('log third info.', thirdInfo);
                       if (thirdInfo.length > 0) {
                           app.$connect(sql_4, data_4).then(async fourthData => {
                               if (fourthData.affectedRows === 1) {
                                   const sixthData = await app.$connect(sql_6, data_6);
                                   if (sixthData.affectedRows === 1) {
                                       ctx.res.send({ code: 200, data: { text: 'update' }, message: "success" })
                                   }
                               }
                           });
                       } else {
                           app.$connect(sql_2, data_2).then(secondData => {
                              if (secondData.affectedRows === 1) {
                                  app.$connect(sql_5, data_5).then(fifthMsg => {
                                      if (fifthMsg.affectedRows === 1) {
                                          ctx.res.send({ code: 200, data: { text: 'create' }, message: 'success' })
                                      }
                                  })
                              }
                           });
                       }
                   })
               } else {
                   let sql_4 = `delete from likeanswer where answerId=? and userId=?`;
                   let data_4 = [result[0].id, ctx.req.body.userId];

                   let sql_5 = `update answer set liked=? where id=?`;
                   let data_5 = [like + 1, result[0].id];

                   let sql_6 = 'update answer set liked=? where id=?';
                   let data_6 = [like - 1, result[0].id];
                   app.$connect(sql_4, data_4).then(async fourthData => {
                       if (fourthData.affectedRows === 1) {
                           const sixthData = await app.$connect(sql_6, data_6);
                           if (sixthData.affectedRows === 1) {
                               ctx.res.send({ code: 200, data: { text: 'update' }, message: "success" })
                           }
                       }
                   });
               }
            });
        } else {
            ctx.res.send({ code: 301, data: "用户未登录！", message: "request" });
        }
    },
});
