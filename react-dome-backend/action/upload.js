const Formidable = require('formidable');
const path = require('path');
const fs = require('fs');

module.exports = {
    uploadFunc: (req, type) => {
        const form = new Formidable.IncomingForm();
        const data = [];
        form.parse(req, (err, files, file) => {
            console.log('log file..', file);

            const fileName = /(upload)\w+$/.exec(file.path);
            const suffix = /\.\w+$/.exec(file.name)[0];     //判断图片格式 jpg/png/jpeg
            const url = path.join(__dirname, `../static${type}/${fileName}${suffix}`);

            fs.writeFileSync(url, fs.readFileSync(file.path));  //fs 读取文档流，并写入到 url 路径下的文件夹
            // res.send({ data: file.name, code: 200, msg: 'success' })
            data.push(file.name);
        });
        console.log('log data..', data);
        return data;
    }
};
