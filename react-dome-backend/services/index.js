const db = require('../config/database');

exports.userInfo = (req, res) => {
    console.log('log userInfo..', req.body, req.params, req.headers);

    let sql = 'select * from user_info';
    db.base(sql, null, response => {
        console.log('log res..', response);
        res.json({ data: response, msg: 'success', code: 20000});
    })
};
