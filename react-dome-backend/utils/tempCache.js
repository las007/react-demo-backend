const redis = require('redis');
const { promisifyAll } = require('bluebird');

const source = {
    keyword: '',
    info: '',
    exTime: ''
};

/*const client = promisifyAll(redis.createClient({

}));*/
const config = {
    host: 'localhost',
    port: 5001,
    password: 123456
};
const client = redis.createClient(config);

const setValue = (key, value, time) => {
    console.log('log setVal..', key, typeof value, time);
    if (value === 'undefined') {
        return null;
    }
    if (key !== 'undefined') {
        console.log('undefined key..', key);
        if (typeof value === 'string') {
            console.log('log sting..', value);
            if (time !== 'undefined') {
                source.keyword = key;
                source.info = value;
                source.exTime = time
                console.log('log source..', source);
                client.set('hello', 'this is a value...');
            }
        }
    }
};

const getValue = () => {
    console.log('log getValue..', source);
    client.get(2, function (err, value) {
        if (!err) {
            console.log('log client value....', value);
        }
    });
    return source;
};

module.exports = {
    setValue,
    getValue
};
