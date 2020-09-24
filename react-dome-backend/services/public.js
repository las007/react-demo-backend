const jwt = require('jsonwebtoken');
const JWTDecode = require('jwt-decode');
const fs = require('fs');
const path = require('path');
const { mailer } = require('../utils/nodemailer');
const { setValue, getValue } = require('../utils/tempCache');

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

exports.forget = (req, res) => {
    console.log('log sendMail..');
    console.log('log forget..', req.body, req.params);

    const validateCode = Math.floor(( ( Math.random() * 9000 ) + 999 )).toString();
    const exTime = Math.round(new Date() / 1000) + 60 * 30;
    const msg = mailer('205718901@qq.com', '[账号找回]', `请在相关网页填写${validateCode}此验证码。`);
    console.log('log mailer msg..', msg, exTime);

    setValue(1, validateCode, exTime);

    res.send({ data: {text: '请在30分钟内登录邮箱查看验证码'}, code: 200, msg: 'success' })
};

exports.getValidateCode = (req, res) => {
  const getVal = getValue();
  console.log('log getVal..', getVal);
  res.send({ data: {}, msg: 'success', code: 200 })
};

exports.tempCache = (req, res) => {
    console.log('log subLogin333..', req.body, req.params, req.headers);
    res.send({ code: 200, msg: 'success', data: {} })
};
exports.getHomePage = (req, res) => {
    console.log('log get home page..');
    res.send({ code: 200, msg: 'success', data: {} });
};
