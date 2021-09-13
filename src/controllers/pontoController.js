const express = require('express');
const { Sequelize, QueryTypes } = require('sequelize');
const database = require('../config/database');
const sequelize = new Sequelize(database);
const fs = require('fs/promises');
const query = require('../query');
const { response } = require('express');


class VolumetriaController {

    async getBD(req, res) {
        try {
            const [data] = await sequelize.query('select * from intra_ponto');
            return res.json(data);
        } catch (err) {
            console.log(err);
            return res.status(400).json();
        }
    }
}


module.exports = new VolumetriaController()