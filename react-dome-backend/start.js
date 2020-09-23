const express = require('express');
const app = express();
const router = require('./routes/test');

class CreateServer {
    $ctrl;
    constructor(props) {
        this.props = props || {};
        this.$ctrl = { msg: '' };
    }

    start() {
        app.use(router);
        app.listen(this.props.port || 3001, () => {
            console.log('服务器已启动成功！端口号为：', this.props.port || 3001)
        })
    }
}

module.exports = CreateServer;
