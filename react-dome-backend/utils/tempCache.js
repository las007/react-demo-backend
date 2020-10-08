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
                // client.set('hello', 'this is a value...');
                client.set(key, value);
            }
        }
    }
};

let text = async (key) => {
    let doc = await new Promise(resolve => {
        client.get(key, function (err, value) {
            if (!err) {
                console.log('log text value..', value);
                return resolve(value)
            }
        });
    });
    console.log('log text doc..', doc);
    return doc
};

let cache;
const getValue = async () => {
    /*console.log('log getValue..', source);
    client.get('captcha', (err, value) => {
        if (!err) {
            console.log('log client value....', value);
            cache = value;
            console.log('log cache2..', cache);
        }
    });

    setTimeout(function () {
        console.log('log async cache..', cache)
        return cache;
    }, 300);
    return await cache
    // client.get('captcha');
    // return source;*/
    client.get = async captcha => {
        return await text(captcha)
    }
};

module.exports = {
    setValue,
    getValue,
    text
};
