const express = require('express');
const { Sequelize, QueryTypes } = require('sequelize');
const database = require('../config/database');
const sequelize = new Sequelize(database);
const fs = require('fs');
const jsftp = require("jsftp");
const { default: axios } = require('axios');


class GestapController {


    /**
    * Rotas que pegam os pontos dos funcionarios baseado na alcada 
    * @param {object} req.body Dados do funcionario para buscar os pontos
    * @return {object} retorna os pontos dos funcionarios
    */
    async getPontos(req, res) {
        try {
            const { id } = req.body;

            const [[infos]] = await sequelize.query(`SELECT alcada, id from INTRA_funcionarios where id = ${id}`);

            let data;

            if (infos.alcada === 3) {
                [data] = await sequelize.query(`
SELECT distinct(intra_ponto.id), count(distinct(INTRA_AnexoPonto.id)) as anexos, intra_ponto.*, intra_funcionarios.nome, intra_funcionarios.departamento, intra_funcionarios.codigo, intra_funcionarios.dtAdmissao FROM INTRA_Ponto
left join intra_funcionarios on INTRA_funcionarios.id = intra_ponto.idFuncionario 
left  join INTRA_AnexoPonto on  INTRA_Ponto.id = INTRA_AnexoPonto.idponto
left join intra_departamento on INTRA_departamento.idGestor = intra_ponto.idGestor
left join INTRA_departamentoxgestor on INTRA_departamentoxgestor.departamento = INTRA_departamento.id
where INTRA_ponto.status < 4
group by intra_ponto.id,
intra_ponto.idFuncionario,
intra_ponto.idGestor,
intra_ponto.data,
intra_ponto.item,
intra_ponto.periodo_de,
intra_ponto.periodo_ate,
intra_ponto.horas,
intra_ponto.justificativa,
intra_ponto.status,
intra_ponto.motivoRecusado,
intra_ponto.nivel1,
intra_ponto.nivel2,
intra_ponto.nivel3,
intra_funcionarios.id,
intra_funcionarios.nome,
intra_funcionarios.departamento,
intra_funcionarios.email,
intra_funcionarios.login,
intra_funcionarios.telefone,
intra_funcionarios.nextel,
intra_funcionarios.celular,
intra_funcionarios.empresa,
intra_funcionarios.foto,
intra_funcionarios.dtAniversario,
intra_funcionarios.dtAdmissao,
intra_funcionarios.dtsaidaFerias,
intra_funcionarios.dtretornoFerias,
intra_funcionarios.acesso,
intra_funcionarios.senha,
intra_funcionarios.gestor,
intra_funcionarios.adm,
intra_funcionarios.acessolivre,
intra_funcionarios.msgNiver,
intra_funcionarios.usuario,
intra_funcionarios.registro,
intra_funcionarios.funcao,
intra_funcionarios.ctps,
intra_funcionarios.codigo,
intra_funcionarios.status,
intra_funcionarios.deletado,
intra_funcionarios.alcada
`);

            } else {


                try {
                    [data] = await sequelize.query(`
                            
SELECT distinct(intra_ponto.id), count(distinct(INTRA_AnexoPonto.id)) as anexos, intra_ponto.*, intra_funcionarios.nome, intra_funcionarios.departamento, intra_funcionarios.codigo, intra_funcionarios.dtAdmissao FROM INTRA_Ponto
left join intra_funcionarios on INTRA_funcionarios.id = intra_ponto.idFuncionario 
left  join INTRA_AnexoPonto on  INTRA_Ponto.id = INTRA_AnexoPonto.idponto
left join intra_departamento on INTRA_departamento.idGestor = intra_ponto.idGestor
left join INTRA_departamentoxgestor on INTRA_departamentoxgestor.departamento = INTRA_departamento.id
where INTRA_departamentoxgestor.idGestor = ${infos.id} and INTRA_ponto.status = ${infos.alcada}
group by intra_ponto.id,
intra_ponto.idFuncionario,
intra_ponto.idGestor,
intra_ponto.data,
intra_ponto.item,
intra_ponto.periodo_de,
intra_ponto.periodo_ate,
intra_ponto.horas,
intra_ponto.justificativa,
intra_ponto.status,
intra_ponto.motivoRecusado,
intra_ponto.nivel1,
intra_ponto.nivel2,
intra_ponto.nivel3,
intra_funcionarios.id,
intra_funcionarios.nome,
intra_funcionarios.departamento,
intra_funcionarios.email,
intra_funcionarios.login,
intra_funcionarios.telefone,
intra_funcionarios.nextel,
intra_funcionarios.celular,
intra_funcionarios.empresa,
intra_funcionarios.foto,
intra_funcionarios.dtAniversario,
intra_funcionarios.dtAdmissao,
intra_funcionarios.dtsaidaFerias,
intra_funcionarios.dtretornoFerias,
intra_funcionarios.acesso,
intra_funcionarios.senha,
intra_funcionarios.gestor,
intra_funcionarios.adm,
intra_funcionarios.acessolivre,
intra_funcionarios.msgNiver,
intra_funcionarios.usuario,
intra_funcionarios.registro,
intra_funcionarios.funcao,
intra_funcionarios.ctps,
intra_funcionarios.codigo,
intra_funcionarios.status,
intra_funcionarios.deletado,
intra_funcionarios.alcada

                                      `);
                } catch (err) {
                    console.log(err)
                }

            }


            return res.json({ data, alcada: infos.alcada });
        } catch (err) {
            console.log(err);
            return res.status(400).json();
        }
    }



    /**
    * Pega os pontos aprovados  por data 
    * @param {object} req.body Dados do gestor que ir?? pegar os pontos aprovados
    * @return {object} retorna os pontos 
    */
    async getPontosAprovados(req, res) {
        try {
            const { dataInicio, dataFim } = req.body;
            const [data] = await sequelize.query(` SELECT distinct(intra_ponto.id ), count(distinct(INTRA_AnexoPonto.id)) as anexos,  intra_ponto.*, intra_funcionarios.nome, intra_funcionarios.departamento, intra_funcionarios.dtAdmissao, intra_funcionarios.codigo, intra_funcionarios.registro FROM INTRA_Ponto
            inner join intra_funcionarios on INTRA_funcionarios.id = intra_ponto.idFuncionario 
            left  join INTRA_AnexoPonto on  INTRA_Ponto.id = INTRA_AnexoPonto.idponto
            inner join intra_departamento on INTRA_departamento.idGestor = intra_ponto.idGestor
            inner join INTRA_departamentoxgestor on INTRA_departamentoxgestor.departamento = INTRA_departamento.id
            where INTRA_ponto.status > 3 and INTRA_Ponto.data BETWEEN '${dataInicio}' and '${dataFim}'
            group by intra_ponto.id,
intra_ponto.idFuncionario,
intra_ponto.idGestor,
intra_ponto.data,
intra_ponto.item,
intra_ponto.periodo_de,
intra_ponto.periodo_ate,
intra_ponto.horas,
intra_ponto.justificativa,
intra_ponto.status,
intra_ponto.motivoRecusado,
intra_ponto.nivel1,
intra_ponto.nivel2,
intra_ponto.nivel3,
intra_funcionarios.nome,
intra_funcionarios.departamento,
intra_funcionarios.dtAdmissao,
intra_funcionarios.registro,
intra_funcionarios.codigo`);

            return res.json(data);
        } catch (err) {
            console.log(err);
            return res.status(400).json();
        }
    }


    /**
    * Pega os arquivos de determinado ponto do usuario
    * @param {object} req.body dados do ponto que ir?? buscar os arquivos
    * @return {object} retorna os arquivos que foram encontrados
    */
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


    /**
    * Recusa um ponto 
    * @param {object} req.body Dados do ponto que ir?? ser recusado
    * @return {object} retorna sucesso ou erro 
    */

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



    /**
    * Aprova um ponto 
    * @param {object} req.body Dados do ponto que ir?? ser aprovado
    * @return {object} retorna sucesso ou erro
    */


    async aprovarPonto(req, res) {
        try {

            const { idPonto, idGestor } = req.body;

            const [[infos]] = await sequelize.query(`SELECT nome, alcada, id from INTRA_funcionarios where id = ${idGestor}`);

            await sequelize.query(`UPDATE intra_ponto set nivel${infos.alcada} = '${infos.nome}', motivoRecusado = '', status = ${infos.alcada + 1} where id = ${idPonto}`);

            return res.json();
        } catch (err) {

            console.log(err);
            return res.status(400).json();
        }
    }
}


module.exports = new GestapController()