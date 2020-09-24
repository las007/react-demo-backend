const jwt = require('jsonwebtoken');

module.exports = function (info) {
    console.log('log jwt info..', info);
  return jwt.sign(info, 'a&*38QthAKuiRwISGLoAStgq^3%^$zvA3A6Hfr8MF$jM*HY4*dWcwAW&9NGp7*b53!', { expiresIn: '6h' });
};
