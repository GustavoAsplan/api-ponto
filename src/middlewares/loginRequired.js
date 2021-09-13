const { Sequelize, QueryTypes } = require('sequelize');
const database = require('../config/database');
const sequelize = new Sequelize(database);
const query = require('../query');
 
async function login(req, res, next) {
    try{

        return next();
    } catch(err){
        return res.status(401).json({
            error: "Não autorizado"
        });
    }
}