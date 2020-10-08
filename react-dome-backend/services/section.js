const { uploadFunc } = require('../action/upload');

module.exports = {
    uploadImage: (req, res) => {
        const data = uploadFunc(req,'cover');
        console.log('log data upload..', data);
        res.send({ code: 200, data: data, msg: 'success' })
    }
};
