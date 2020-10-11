const nodemailer = require('nodemailer');

function mailer(to, subject, text) {
    console.log('log start mailer..');
    const transmit = nodemailer.createTransport({

        host: 'smtp.qq.com',
        port: 587,
        secure: false, //
        auth: {
            user: '205718901@qq.com',
            pass: 'jofkubhcpprhbibg',
        },
    });

    let msg = transmit.sendMail({
        from: '"网络管理员"<205718901@qq.com>',
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

