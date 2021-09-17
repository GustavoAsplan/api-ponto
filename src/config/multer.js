const multer = require('multer');
const { extname, resolve } = require('path');
const sftpStorage = require('multer-sftp')

const aleatorio = () => Math.floor(Math.random() * 10000 + 10000);

const storage = sftpStorage({
    sftp: {
        host: 'suporte.asplan.com.br',
        username: 'asplan',
        password: '4spl4n*',
        port: 22,

    },
    destination: (req, file, cb) => {
        return cb(null, '/tmp/');
    },

    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
},
)

module.exports = storage;


