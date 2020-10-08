module.exports = app => ({
    testFunc: (req, res) => {
        console.log('log conductor testFunc..', req.body, req.params, req.headers);
        res.send({ data: 'everything', code: 200, msg: 'success' })
    }
});
