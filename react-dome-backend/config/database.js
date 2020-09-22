const mysql = require('mysql');

exports.base = (sql, data, callback) => {
    //1、创建数据库连接
    const connect = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'backend'
    });

    //2、执行连接
    connect.connect();

    //3、操作数据库
    connect.query(sql, data, function (error, result, field) {
        // if (error) throw error;
        if (error) {
            console.log('log error msg..', error);
        }
        callback(result);
    });

    //4、结束连接
    connect.end();
};
