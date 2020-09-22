const Server = require('./start');

const connect = new Server({port: 8086});

connect.start();
