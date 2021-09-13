const express = require('express');
const { Sequelize, QueryTypes } = require('sequelize');
const database = require('./config/database');
const Crypt = require('./services/crypts');
const fs = require('fs')
//const sequelize = new Sequelize(database);

class Query {
    async execute(query, type, obj) {
        const sequelize = new Sequelize({
            dialect: 'mssql',
            host: obj.host,
            port: 1433,
            username: obj.username,

            password: Crypt.b64_to_utf8(obj.password),
            database: obj.database,
            logging: false,
            connectionTimeout: 3000000,
            requestTimeout: 3000000,
            define: {
                timestamps: true,
                underscored: false,
                underscoredAll: false,
                createdAt: false,
                updatedAt: false,
            },
            dialectOptions: {
                timezone: 'America/Sao_Paulo',
            },
            timezone: 'America/Sao_Paulo',
        });

        try {
            return await sequelize.query(query, { type: type });
        } catch (err) {
            console.log(err)
            throw new Error
        }

    }
}

module.exports = new Query().execute