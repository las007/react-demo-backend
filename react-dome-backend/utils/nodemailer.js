const nodemailer = require('nodemailer');

function mailer(to, subject, text) {
    console.log('log start mailer..');
    const transmit = nodemailer.createTransport({
        /*host: 'smtp.qq.com',
        port: 578,
        auth: {
            user: '305718901@qq.com',
            pass: 'jgz132266'
        }*/
        host: 'smtp.qq.com',
        port: 587,
        secure: false, //
        auth: {
            user: '843006076@qq.com',
            pass: 'lekjbvctotezbeei',
        },
    });

    let msg = transmit.sendMail({
        from: '"网络管理员"<843006076@qq.com>',
        to: to || '205718901@qq.com',
        subject: subject || '[忘记密码，账号找回]',
        text: text || '请在30分钟内输入验证码..'
    }, function (error, info) {
        if (error) {
            console.log('log mail err..', error);
            return error
        }else {
            console.log('log mail info..', info)
        }
    })
}

// mailer().catch(console.error);

module.exports = {
    mailer
};

