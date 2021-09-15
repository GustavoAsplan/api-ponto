const express = require('express');
const pontoRoutes = require('./src/routes/ponto.routes');
const cors = require('cors');
const { resolve } = require('path');


const whitelist = ['https://suporte.asplan.com.br/', 'http://localhost:3000', 'http://localhost:3001'];
const corsOptions = {
    origin(origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
};
class App {
    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();

    }

    routes() {
        this.app.use('/', pontoRoutes);
    }

    async middlewares() {
        this.app.use(express.json({ limit: '100mb', extended: true, parameterLimit: 50000 }));
        this.app.use(express.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));
        this.app.use(cors(corsOptions));
        this.app.use(express.static(resolve(__dirname, 'uploads')));


    }
}
module.exports = new App().app;
