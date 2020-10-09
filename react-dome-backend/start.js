const express = require('express');
const app = express();
const router = require('./routes/test');
const bodyParser = require('body-parser');
const { useRouter, conductor } = require("./babel-loader");
const connect = require('./utils');
const actionLink = require('./services');
const db = require('./config/database');

class CreateServer {
    constructor(props) {
        this.props = props || {};
        // this.$ctrl = { msg: '' };
        this.$app = express();
        this.$router = express.Router();
        this.$act = conductor(this);
        console.log('log this action..', this.$act);
        console.log('log router..', router);
        this.$services = connect;
        this.$link = actionLink;
        this.$db = db;
        //express 默认不能获取到 req.body 的值，必须加上 body-parser 中间件
        this.$app.use(bodyParser.urlencoded({ extended: false/*, elementJSON: true*/ }));
        this.$app.use(bodyParser.json());
        //并且要在 app.use(router); 之前使用？！
        useRouter(this)
    }

    start() {
        //express 默认不能获取到 req.body 的值，必须加上 body-parser 中间件
        this.$app.use(bodyParser.urlencoded({ extended: false/*, elementJSON: true*/ }));
        this.$app.use(bodyParser.json());
        //并且要在 app.use(router); 之前使用？！
        this.$app.use(router);

        this.$app.get('/test/user/getRouteList', (req, res) => {
            console.log('log gegRouteList...');
            res.send({ data: 'nothing', code: 200, msg: 'success' })
        });
        this.$app.listen(this.props.port || 3001, () => {
            console.log('服务器已启动成功！端口号为：', this.props.port || 3001)
        })
    }
}

module.exports = CreateServer;
