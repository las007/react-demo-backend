const jwt = require('jsonwebtoken');
const JWTDecode = require('jwt-decode');
const fs = require('fs');
const path = require('path');
const { mailer } = require('../utils/nodemailer');
const { setValue, getValue, text } = require('../utils/tempCache');
const db = require('../config/database');
const connectDB = require('../config/connectDB');

exports.sign = (req, res) => {
    const jwtToken = jwt.sign({username: 'las007', password: 'jgz136509'}, 'a&*38QthAKuiRwISGLoAStgq^3%^$zvA3A6Hfr8MF$jM*HY4*dWcwAW&9NGp7*b53!', { expiresIn: '6h' },);
    console.log('log jwtToken..', jwtToken);
    fs.writeFileSync(path.join(__dirname, '../public/text'), jwtToken);
    /*this.$ctrl.msg = jwtToken;
    console.log('log this ctrl..', this.$ctrl.msg);*/
    res.send(jwtToken);
};

exports.verify = (req, res) => {
    const readToken = fs.readFileSync(path.join(__dirname, '../public/text'), 'utf-8');
    console.log('log read token..', readToken);

    console.log('jwt decode..', JWTDecode(readToken));
    jwt.verify(readToken, 'a&*38QthAKuiRwISGLoAStgq^3%^$zvA3A6Hfr8MF$jM*HY4*dWcwAW&9NGp7*b53!', (error, decode) => {
        if (error) {
            console.log('log err..', error);
            res.send(JWTDecode(readToken));
            return error
        }
        console.log('校验..', decode);
        res.send({ decode: decode, msg: 'success', code: 200 });
    });
};

exports.forget = async (req, res) => {
    console.log('log sendMail..');
    console.log('log forget..', req.body, req.params);

    const validateCode = Math.floor(( ( Math.random() * 9000 ) + 999 )).toString();
    const exTime = Math.round(new Date() / 1000) + 60 * 30;

    let sql = `select * from users where email=?`;
    let data = req.body.email;
    /*const temp = await new Promise(resolve => {
        db.base(sql, data, result => {
            return resolve(result)
        })
    });
    const userInfo = JSON.parse(JSON.stringify(temp));
    console.log('log remp..', userInfo[0].id);*/

    db.base(sql, data, result => {
        console.log('log forget msg..', result);
        if (Object.keys(result).length > 0) {
            const userInfo = JSON.parse(JSON.stringify(result));
            console.log('log remp..', userInfo[0].id);

            const msg = mailer('205718901@qq.com', '[账号找回]', `请在相关网页填写${validateCode}此验证码。`);
            console.log('log mailer msg..', msg, exTime, validateCode);
            setValue(userInfo[0].id, validateCode, exTime);
            res.send({ data: {text: '请在30分钟内登录邮箱查看验证码'}, code: 200, msg: 'success' })
        }else {
            res.send({ data: {}, code: 201, msg: '查无此人！请确认您的账号关联邮箱无误。' })
        }
    });
};

exports.checkCode = async (ctx) => {
    console.log('log check code2..', ctx.req.body);
    let sql = `select * from users where email=?`;
    let data = ctx.req.body.email;

   /* const temp = await new Promise(resolve => {
        db.base(sql, data, result => {
            return resolve(result);
        })
    });
    const userInfo = JSON.parse(JSON.stringify(temp));*/

    const userInfo = await connectDB(sql, data);

    if (userInfo.length === 1) {
        const value = await text(userInfo[0].id);
        if (value === ctx.req.body.validateCode) {
            ctx.res.send({ code: 200, data: {}, msg: '验证成功，请重置密码' })
        }else {
            ctx.res.send({ code: 501, data: {}, msg: '验证失败，请输入正确的验证码' })
        }
    }else {
        ctx.res.send({ code: 503, data: {}, msg: '请求有误，请重新获取验证码' })
    }
};

exports.resetPW = async (ctx) => {
    console.log('log resetPW..', ctx.req.body);
    let sql = `select * from users where email=?`;
    let data = ctx.req.body.email;
    const userInfo = await connectDB(sql, data);

    if (userInfo.length > 0) {
        const value = await text(userInfo[0].id);
        if (value === ctx.req.body.validateCode) {
            let sql2 = `update users set password=? where id=?`;
            let data2 = [ctx.req.body.password, userInfo[0].id];
            connectDB(sql2, data2);
            ctx.res.send({ code: 200, data: {}, msg: 'success' })
        }else {
            ctx.res.send({ code: 501, data: {}, msg: 'fail' })
        }
    } else {
        ctx.res.send({ code: 503, data: {}, msg: '请求有误，请重新获取验证码' })
    }
};

exports.getValidateCode = (req, res) => {
  const getVal = getValue();
  console.log('log getVal..', getVal);
  res.send({ data: {}, msg: 'success', code: 200 })
};

exports.tempCache = (ctx) => {
    console.log('log subLogin333..', ctx.req.body, ctx.req.params, ctx.req.headers);
    ctx.res.send({ code: 200, msg: 'success', data: {} })
};
exports.getHomePage = (req, res) => {
    console.log('log get home page..');
    res.send({ code: 200, msg: 'success', data: {} });
};
