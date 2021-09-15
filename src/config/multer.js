const multer = require('multer');
const { extname, resolve } = require('path');
const sftpStorage = require('multer-sftp')

const aleatorio = () => Math.floor(Math.random() * 10000 + 10000);

module.exports = function () {

    const storage = sftpStorage({
        sftp: {
            host: 'suporte.asplan.com.br',
            user: 'asplan',
            pass: '4spl4n*',
            port: 22,

        },
        destination: (req, file, cb) => {
            cb(null, 'tmp/');
        },

        filename: (req, file, cb) => {
            cb(null, `${Date.now()}_${aleatorio()}${extname(file.originalname)}`);
        },
    },
    )



    return {
        storage: storage
    }
};