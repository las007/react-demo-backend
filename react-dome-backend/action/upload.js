const Formidable = require('formidable');
const path = require('path');
const fs = require('fs');

module.exports = {
    uploadFunc: (req, res) => {
        const form = new Formidable.IncomingForm();
        const data = [];
        form.parse(req, (err, files, file) => {
            console.log('log file..', file, file.avatar, file.path, /(upload)\w+$/.exec(file.path), /\/(upload\w*)/.exec(file.path));

            const fileName = /(upload)\w+$/.exec(file.avatar.path);
            // const fileName = /(upload\w*)/.exec(file.avatar.path);
            console.log('log file name..', fileName);
            const suffix = /\.\w+$/.exec(file.avatar.name)[0];     //判断图片格式 jpg/png/jpeg
            const url = path.join(__dirname, `../static/avatar/${fileName}${suffix}`);
            console.log('log suff..', fileName, suffix);
            data.push(`/avatar/${fileName}${suffix}`)

            console.log('log url..', url, fs.readFileSync(file.avatar.path));

            fs.writeFileSync(url, fs.readFileSync(file.avatar.path));  //fs 读取文档流，并写入到 url 路径下的文件夹
            data.push(file.avatar.name);
            console.log('log name..', file.avatar);
            res.send({ data: data, code: 200, msg: 'success' })
            // res.sendFile(path.join(__dirname, `../static/${data[0]}`));
            console.log('log data..', data[0]);
            // res.sendFile(path.join(__dirname, `../static/avatar/upload_3c8e3d24452fc6c855e7e0412688da3f,upload.jpg`))
        });
        console.log('log data..', data);
        return data;
    }
};
