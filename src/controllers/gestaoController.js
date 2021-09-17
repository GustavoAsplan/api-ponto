const express = require('express');
const { Sequelize, QueryTypes } = require('sequelize');
const database = require('../config/database');
const sequelize = new Sequelize(database);
const fs = require('fs');
const jsftp = require("jsftp");
const { default: axios } = require('axios');


class GestapController {

    async getPontos(req, res) {
        try {
            const { id } = req.body;

            const [[infos]] = await sequelize.query(`SELECT alcada, id from INTRA_funcionarios where id = ${id}`);


            const [data] = await sequelize.query(`
            SELECT intra_ponto.*, intra_funcionarios.nome, intra_funcionarios.departamento, INTRA_departamentoxgestor.idGestor as ID_GESTOR FROM INTRA_Ponto
                        inner join intra_funcionarios on INTRA_funcionarios.id = intra_ponto.idFuncionario 
                        inner join intra_departamento on INTRA_departamento.idGestor = intra_ponto.idGestor
                        inner join INTRA_departamentoxgestor on INTRA_departamentoxgestor.departamento = INTRA_departamento.id
                        where INTRA_departamentoxgestor.idGestor = ${infos.id} and INTRA_ponto.status = ${infos.alcada}`);
            return res.json(data);
        } catch (err) {
            console.log(err);
            return res.status(400).json();
        }
    }

    async getFiles(req, res) {
        try {
            const { idPonto } = req.body;

            const [data] = await sequelize.query(`select * from intra_anexoponto where idponto = ${idPonto}`);

            return res.json(data);
        } catch (err) {
            console.log(err);
            return res.status(400).json();
        }
    }

    async recusarPonto(req, res) {
        try {
            const { idPonto, motivo, idGestor } = req.body;

            const [[infos]] = await sequelize.query(`SELECT alcada, id from INTRA_funcionarios where id = ${idGestor}`);

            await sequelize.query(`UPDATE intra_ponto set motivoRecusado = '${motivo}', status = ${infos.alcada - 1} where id = ${idPonto}`);

            return res.json();
        } catch (err) {

            console.log(err);
            return res.status(400).json();
        }
    }

    async aprovarPonto(req, res) {
        try {
            console.log(req.body)
            const { idPonto, idGestor } = req.body;

            const [[infos]] = await sequelize.query(`SELECT alcada, id from INTRA_funcionarios where id = ${idGestor}`);

            await sequelize.query(`UPDATE intra_ponto set motivoRecusado = '', status = ${infos.alcada + 1} where id = ${idPonto}`);

            return res.json();
        } catch (err) {

            console.log(err);
            return res.status(400).json();
        }
    }
}


module.exports = new GestapController()