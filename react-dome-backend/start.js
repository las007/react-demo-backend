const express = require('express');
const app = express();
const router = require('./routes/test');
const bodyParser = require('body-parser');

class CreateServer {
    $ctrl;
    constructor(props) {
        this.props = props || {};
        this.$ctrl = { msg: '' };
    }

    start() {
        //express 默认不能获取到 req.body 的值，必须加上 body-parser 中间件
        app.use(bodyParser.urlencoded({ extended: false/*, elementJSON: true*/ }));
        app.use(bodyParser.json());
        //并且要在 app.use(router); 之前使用？！
        app.use(router);
        app.listen(this.props.port || 3001, () => {
            console.log('服务器已启动成功！端口号为：', this.props.port || 3001)
        })
    }
}

module.exports = CreateServer;
