const express = require('express');
const { Sequelize, QueryTypes } = require('sequelize');
const database = require('../config/database');
const sequelize = new Sequelize(database);
const fs = require('fs/promises');
const query = require('../query');
const { response } = require('express');


class VolumetriaController {

    async getInfoUser(req, res) {
        try {
            const { id } = req.body;
            const [[data]] = await sequelize.query(`SELECT INTRA_funcionarios.departamento, INTRA_funcionarios.nome, 
            INTRA_departamento.idgestor,
             INTRA_funcionarios.id from INTRA_departamento inner join INTRA_funcionarios on  INTRA_funcionarios.departamento = INTRA_departamento.departamento where 
             INTRA_funcionarios.id = ${id}`)
            return res.json(data);
        } catch (err) {
            console.log(err);
            return res.status(400).json();
        }
    }
    async getPontosUser(req, res) {
        try {
            const { id } = req.body;
            const [data] = await sequelize.query(`SELECT * from intra_ponto where idFuncionario = ${id} and status = 1 `)
            return res.json(data);
        } catch (err) {
            console.log(err);
            return res.status(400).json();
        }
    }
    async SavePonto(req, res) {
        try {

            const { ponto } = req.body;
            const { idFuncionario, date, idGestor, item, justificativa, periodoDe, periodoAte,
                horas } = ponto;
            await sequelize.query(`INSERT INTO INTRA_Ponto (idFuncionario, idGestor, data, item, periodo_de, periodo_ate, horas, justificativa, status) 
            values (${idFuncionario}, ${idGestor}, '${date}', '${item}', '${periodoDe}', '${periodoAte}', '${horas}', '${justificativa}', 1)`)
            return res.json();
        } catch (err) {
            console.log(err);
            return res.status(400).json();
        }
    }
    async DeletePonto(req, res) {
        try {

            const { id } = req.body;
            await sequelize.query(`UPDATE INTRA_ponto set status = '-1' where id = ${id}`);
            return res.json();
        } catch (err) {
            console.log(err);
            return res.status(400).json();
        }
    }
    async AtualizarPonto(req, res) {
        try {
            const { id, ponto } = req.body;
            const { idFuncionario, date, idGestor, item, justificativa, periodoDe, periodoAte,
                horas } = ponto;

            await sequelize.query(`UPDATE INTRA_Ponto set data = '${date}' , item = '${item}' , periodo_de = '${periodoDe}' , periodo_ate = '${periodoAte}' , horas = '${horas}' , justificativa = '${justificativa}' where id = ${id} `);
            return res.json();
        } catch (err) {
            console.log(err);
            return res.status(400).json();
        }
    }
}


module.exports = new VolumetriaController()