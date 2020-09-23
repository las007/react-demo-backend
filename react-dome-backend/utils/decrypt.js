const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

module.exports = function (encryptMsg) {
    const privateKey = fs.readFileSync(path.join(__dirname, '../public/rsa_private_key.pem'), 'utf-8');
    let buffer = Buffer.from(encryptMsg, 'base64');
    console.log('log buffer..', buffer);
    let decrypted = crypto.privateDecrypt({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
    }, buffer);
    return decrypted.toString('utf-8')
};
