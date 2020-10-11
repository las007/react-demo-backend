const db = require('./database');

module.exports = async (sql, data) => {
    const temp = await new Promise(resolve => {
        db.base(sql, data, result => {
            return resolve(result);
        })
    });
    return JSON.parse(JSON.stringify(temp));
};
