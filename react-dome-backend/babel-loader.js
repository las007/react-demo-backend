const path = require('path');
const fs = require('fs');


//三个 flush 用于开发模式的更新
const flushMysql = false
const flushApiConfig = false
const flushApiRouter = false

//加载目录
function load(dir, cb) {
    const url = path.resolve(__dirname, dir)
    console.log('log url..', url);
    const files = fs.readdirSync(url)

    console.log('log files..', files);
    files.forEach((fileName) => {
        console.log('log fileName..', fileName);

        //获取文件名 除去.js
        fileName = fileName.replace(/\.js/, '')
        //导入文件
        let module = require(`${url}/${fileName}`)
        console.log('log url fileName..', `${url}/${fileName}`);
        console.log('log module..', module);
        cb(fileName, module)
    })
}

//加载目录
function loadMenu(dir, cb) {
    const url = path.resolve(__dirname, dir)
    const files = fs.readdirSync(url)
    files.forEach((fileName) => {
        //获取文件名 除去.js
        fileName = fileName.replace(/\.js/, '')
        //导入文件
        let module = require(`${url}/${fileName}`)
        cb(fileName, module)
    })
}

module.exports = {
    //初始化 router
    useRouter: function (app) {
        console.log('log useRoute app...', app);
/*        (function (dir = 'constRoute', cb) {
            const url = path.resolve(__dirname, dir);
            const files = fs.readdirSync(url);
            files.forEach(fileName => {
                fileName = fileName.replace('/\.js/', '');
                const module = require(`${url}/${fileName}`);
                cb(fileName, module)
            });
        })();

        loadMenu('constRoute', function (fileName, constRoute) {

        })*/

        //自动化生成 frontend 的 api 文件
        const api = {}

        //admin
        load('constRoute', function(fileName, constRoute) {
            console.log('log constRoute typeof...', typeof constRoute, constRoute, fileName);

            // /api/admin
            const prefix = `/${fileName}`
            // 避免生成的 API 文件报错
            api[fileName] = []
            //传入 app 返回对象
            constRoute = constRoute(app)
            //遍历键
            Object.keys(constRoute).forEach(key => {
                console.log('log route key..', key, typeof key, constRoute);
                // /getRouterList get
                const [ route, method ] = key.split(', ')
                //后期导入到 API 文件用
                const router = { name: `${route.slice(1)}`, route: `${prefix}${route}`, method }
                //是否强制更新我们的文件
                if (flushApiRouter || flushApiConfig) api[fileName].push(router)
                console.log('log route method>>>>', method);
                console.log('正在映射地址', `${method.toLocaleUpperCase()} ${router.route}`)
                //注册路由
                //app.$app = express()
                //app.$app.get('/api/admin/getRouterList')
                console.log('log app method..', app.$app);
                app.$app.get('/test/admin/getRouteList', (req, res) => {
                    console.log('log app something...');
                    res.send({ data: 'something...', code: 200, msg: 'success' })
                });
                app.$app[method](prefix + route, async (req, res) => {
                    //将 req,res 赋值给 ctx
                    console.log('log app getRoute...', method, prefix, route, key, route[key]);
                    console.log('log route key2..', constRoute, key, constRoute[key]);

                    app.ctx = { req, res }
                    /*await errorHandler.global(app, fileName, method, route)*/
                    /*await ((app, fileName, method, route) => async cb => {
                        try {
                            console.log('log cb..', cb);
                            return await cb()
                        }catch (e) {
                            console.log(e);
                            app.ctx.res.send({
                                code: 501,
                                data: {
                                    path: `错误来源：${method} ${fileName} ${route}`
                                },
                                info: e
                            })
                        }
                    })*/
                    /*(async function() {
                        // await constRoute[key]()
                    })*/
                    constRoute[key]();

                })
            })
        })
        //自动化生成文件
        /*if (flushApiRouter) {
            Object.keys(api).forEach(key => {
                let content = [ `import request from '@/utils/request'` ]
                api[key].forEach(router => {
                    content.push(`export function ${router.name}() {
          return request({
            url:'${router.route}',
            method:'${router.method}'
          })
        }`)
                })
                //写入到前端 src/api.js
                fs.writeFileSync(path.join(__dirname, `../frontend/src/api/${key}.js`), content.join('\n'))
            })
        }*/
/*
        if (flushApiConfig) {
            let apiContent = [ 'export default {' ]
            Object.keys(api).forEach(key => {
                let content = [ `${key}: {` ]
                api[key].forEach(router => {
                    content.push(`${router.name}: '${router.route}',`)
                })
                content.push('},')
                apiContent.push(content.join('\r'))
            })
            apiContent.push('}')
            fs.writeFileSync(path.join(__dirname, `../frontend/src/config/api.js`), apiContent.join('\r'))

        }*/
    },

    conctroller: function (app) {
        const controllers = {};
        load('controller', (fileName, controller) => {
            controllers[fileName] = {}
            Object.keys(controller(app)).forEach(key => {
                controllers[fileName][key] = async (...args) => {
                    return await errorHandler.error({
                        controllerName: `$ctrl.${fileName}.${key}`,
                    })(async function() {
                        return await controller(app)[key](...args)
                    })
                }
            })
        })
        return controllers
    },

    conductor: function (app) {
        const conductors = {};
        console.log('log some app...', app);
        load('conductor', function (fileName, action) {
            console.log('log conductors msg..', fileName, action);
            conductors[fileName] = {};

            if (action && typeof action === 'function') {
                // console.log('log action2..', action, action(app));
                Object.keys(action(app)).forEach(key => {
                    console.log('log the action key...', key);
                    console.log('log actionFileNameKey...', action, fileName, conductors[fileName], conductors[fileName][key]);
                    console.log('log action key..', action(app)[key]);
                    conductors[fileName][key] = (...args) => {
                        console.log('log args..', args);
                        console.log('log appKey..', action(app)[key](...args));
                        return action(app)[key]

                        /*return (function() {
                            console.log('log end msg..', action(app)[key](...args));
                            return action(app)[key](...args)
                        })*/
                    }
                    // Object.keys(conductors).forEach()
                    // Object.keys(conductors).push(action(app)[key]);
                });
            }
        });
        console.log('log this conductors..', conductors);
        return conductors
    }
};
