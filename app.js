const express = require('express');
const pontoRoutes = require('./src/routes/ponto.routes');
const cors = require('cors');



const whitelist = ['https://suporte.asplan.com.br/', 'http://localhost:3000', 'http://localhost:3001'];
const corsOptions = {
    origin(origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
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
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(cors(corsOptions));

    }
}
module.exports = new App().app;
