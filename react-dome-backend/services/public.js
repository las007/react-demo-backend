const jwt = require('jsonwebtoken');
const JWTDecode = require('jwt-decode');
const fs = require('fs');
const path = require('path');

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
