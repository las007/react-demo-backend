const db = require('../config/database');
const fs = require('fs');
const path = require('path');
const { decrypt } = require('../utils');
const svgCaptcha = require('svg-captcha');
const { setValue, getValue, text } = require('../utils/tempCache');
const sign = require('../utils/jwtSign');
const JWTDecode = require('jwt-decode');

exports.userInfo = (req, res) => {
    console.log('log userInfo..', req.body, req.params, req.headers);

    let sql = 'select * from user_info';
    db.base(sql, null, response => {
        console.log('log res..', response);
        if (response) {
            res.json({ data: response, msg: 'success', code: 20000});
        }else {
            res.send({ code:501, data: {}, msg: '查询失败！！' })
        }
    })
};

exports.getPublicKey = (req, res) => {
    const publicKey = fs.readFileSync(path.join(__dirname, '../public/rsa_public_key.pem'), 'utf-8');
    console.log('log public key..', publicKey);
    res.send({
        code: 20000,
        data: publicKey
    })
};

exports.subLogin = async (req, res) => {
    console.log('log subLogin..', req.body, req.params, req.headers);

    if (!req.body.isLogout) {
        // let sql = 'select * from account where username=? and password=?';
        // let sql = 'select * from account where username=?';
        let sql = 'select * from admins where username=?';

        // let data = [req.body.username, req.body.password];

        let data = [req.body.username];

        if (req.body && req.body.username !== 'undefined') {
            // const tempCapt = getValue('captcha');

            const tempCapt = await text('captcha');
            console.log('log tempCapt..', tempCapt);

            /*Promise.resolve(tempCapt).then(res => {
                console.log('log temp res..', res);
            });
            text('captcha').then(data => {
                console.log('log text data...', data)
            });
            const b = await text('captcha');
            console.log('log listFn', b);*/

            if (tempCapt === req.body.captcha) {
                db.base(sql, data, result => {
                    console.log('log res subLogin..', result, typeof result, result === null);
                    console.log('log login result..', Object.keys(result).length);
                    // if (result) {
                    if (Object.keys(result).length > 0) {
                        const token = sign({ username: req.body.username, password: req.body.password, publicKey: req.body.publicKey });
                        res.send({ data: {token}, code: 200, msg: 'success' });
                    }else {
                        res.send({ data: '查无此人！', code: 501, msg: 'fail' });
                    }
                })
            }else res.send({ code: 503, msg: 'undefined', data: { text: '验证码错误！'} })
        }else {
            res.send({ code: 501, msg: 'fail', data: {text: '查无此人'} });
        }
    }else {
        res.send({ code: 502, msg: 'success', data: {text: '退出成功'} })
    }
};

exports.logout = (req, res) => {
    console.log('log logout suc..');
    res.send({ code: 200, msg: 'success', data: {text: '退出成功' }});
};

exports.register = (req, res) => {
    console.log('log register..', req.body, req.params, req.headers);

    let sql = 'select * from admins where username=?';
    let data = [req.body.username, req.body.password, req.body.email, req.body.phone, req.body.age, req.body.sex, req.body.nickName];
    db.base(sql, data, result => {
        if (result.length === 0) {
            let sql_2 = 'insert into admins set username=?, password=?, email=?, phone=?, age=?, sex=?, nickname=?';
            db.base(sql_2, data, response => {
                res.json({ code: 200, msg: 'success', data: response })
            })
        }else {
            res.json({ code: 501, msg: '该用户名已被占用', data: {}})
        }
    });
};

exports.test = (req, res) => {
    console.log('log test..');
    const decryptInfo = decrypt('jNv99yuF7TZZiHlqg1RIo66zlbmUCMrOzzIOkdzik/DNwipGteFwPU5jWSNED2aQMG/yPoCm8HxiMU5W7wyPjeZ9o9OkMsrN4L9gfLBck8Qzlkadwgkjws54Q4k2cBU6QFhw70LkrPhSlD17s/LzLlVjRuoCTSOds4BXXSOuidw=');
    console.log('log test..', decryptInfo);
    const getVal = getValue();
    console.log('log getVal2..', getVal);
    res.json({ code: 20000, data: decryptInfo, msg: 'success' })
};

exports.getCaptcha = (req, res) => {
    console.log('log captcha..');
    const svg = svgCaptcha.create({
        color: true,
        size: 4,
        noise: 2,
        ignoreChars: '0oli'
    });
    console.log('log svg...', svg);

    setValue('captcha', svg.text);

    res.type('svg');
    res.send(svg.data)
};
