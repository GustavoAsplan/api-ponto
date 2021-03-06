const express = require('express');
const { Sequelize, QueryTypes } = require('sequelize');
const database = require('../config/database');
const sequelize = new Sequelize(database);
const fs = require('fs');
const ftp = require('basic-ftp');
const path = require('path');
const jsftp = require("jsftp");
const Blob = require('blob');
const { default: axios } = require('axios');
const multer = require('multer')
const multerConfig = require('../config/multer')
class PontoController {



    /**
    * Pega informações do usuario
    * @param {object} req.body.id ID do usuario que sera buscado 
    * @return {object} Retorna um objeto com as informações do usuario
    */
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


    /**
    * Pega os pontos dos usuarios
    * @param {object} req.body.id ID do usuario que sera buscado 
    * @return {object} Retorna os pontos do usuario 
    */
    async getPontosUser(req, res) {
        try {
            const { id } = req.body;
            const [data] = await sequelize.query(`SELECT * from intra_ponto where idFuncionario = ${id} and (status = 1  or status = 0)`)
            return res.json(data);
        } catch (err) {
            console.log(err);
            return res.status(400).json();
        }
    }



    /**
    * Insere os arquivos no FTP
    * @param {object} req.body dados dos arquivos e onde deve ser gravado
    * @param {number} id id do usuario que irá inserir os arquivos 
    * @return {void}
    */
    static async insertFiles(req, id) {
        try {
            const { idFuncionario } = req.body;
            const client = new ftp.Client();
            client.ftp.verbose = true;
            let array = req.files;

            for (let index of array) {
                let random = Math.floor(Math.random() * (10000 - 1)) + 1;
                let ex = index.originalname.split('.');
                let name = `${Date.now()}-${random}.${ex.pop()}`;



                try {
                    await sequelize.query(`INSERT INTO intra_anexoponto (idFuncionario, nome, data, idponto)
                    values (${idFuncionario}, '${name}', GETDATE(), ${id})`)
                } catch (err) {
                    console.log(err);
                    throw new Error;
                }

                const ftp = new jsftp({
                    host: 'suporte.asplan.com.br',
                    user: 'asplan',
                    pass: '4spl4n*',
                    port: 21
                });

                await ftp.raw("mkd", `/httpdocs/intranet/anexos/${id}`, (err, data) => {
                    if (err) { }

                });
                const ftpFile = new jsftp({
                    host: 'suporte.asplan.com.br',
                    user: 'asplan',
                    pass: '4spl4n*',
                    port: 21
                });
                await ftpFile.put(index.buffer, `/httpdocs/intranet/anexos/${id}/${name}`, (err) => {
                    if (!err) {
                        console.log("File transferred successfully!");
                    } else {
                        console.log(err)
                    }
                });

                ftp.on('error', () => {

                });

                ftpFile.on('error', () => {

                })

            }
        } catch (err) {
            console.log(err)
            throw new Error;
        }
    }



    /**
    * Pega os arquivos que foram inseridos no banco de dados
    * @param {object} req.body dados de quem buscar os arquivos
    * @return {object} retorna os arquivos do usuario
    */

    async getFiles(req, res) {
        try {
            const { id } = req.body;
            const [data] = await sequelize.query(`SELECT * FROM INTRA_anexoponto where idponto = ${id}`);
            return res.json(data);
        } catch (err) {
            console.log(err);
            return res.status(400).json();
        }
    }



    /**
    * Salva os pontos
    * @param {object} req.body Salva os pontos no banco de dados 
    * @return {object} retorna sucesso ou erro 
    */
    async SavePonto(req, res) {
        try {
            const upload = multer(multerConfig).array('arquivos');
            return upload(req, res, async (error) => {
                if (error) {
                    console.log(error);
                    return res.status(400).json();
                }

                const { idFuncionario, date, idGestor, item, justificativa, periodoDe, periodoAte,
                    horas } = req.body;


                const [[id]] = await sequelize.query(`INSERT INTO INTRA_Ponto (idFuncionario, idGestor, data, item, periodo_de, periodo_ate, horas, justificativa, status) 
            values (${idFuncionario}, ${idGestor}, '${date}', '${item}', '${periodoDe}', '${periodoAte}', '${horas}', '${justificativa}', 1)
            SELECT SCOPE_IDENTITY() as id`)

                await PontoController.insertFiles(req, id.id);
                return res.json();
            })

        } catch (err) {
            console.log(err);
            return res.status(400).json();
        }
    }


    /**
    * Retorna os pontos dos ultimos 30 dias
    * @param {object} req.body dados de quem buscar os pontos
    * @return {object} retorna os pontos dos ultimos 30 dias
    */

    async lastPontos(req, res) {
        try {
            const { id } = req.body;
            const [data] = await sequelize.query(`
            SELECT * FROM  INTRA_Ponto
       WHERE Cast(data as date) >= DATEADD(day,-30,GETDATE()) 
       and   Cast(data as date) <= getdate()
       and idFuncionario = ${id}
       and status > 1`);

            return res.json(data);
        } catch (err) {
            console.log(err);
            return res.status(400).json();
        }
    }


    /**
    * Delete o ponto e os arquivos no FTP
    * @param {object} req.body Dados do ponto que irá ser deletado 
    * @return {object} retorna sucesso ou erro
    */
    async DeletePonto(req, res) {
        try {

            const { id } = req.body;
            const [data] = await sequelize.query(`SELECT * FROM intra_anexoponto where idponto = ${id}`);
            for (let item of data) {

                try {
                    await sequelize.query(`DELETE intra_anexoponto where id = ${item.id}`);
                    const ftp = new jsftp({
                        host: 'suporte.asplan.com.br',
                        user: 'asplan',
                        pass: '4spl4n*',
                        port: 21
                    });

                    await ftp.raw('dele', `httpdocs/intranet/anexos/${item.idponto}/${item.nome}`, (err) => {
                        if (!err) {
                            console.log("File delete successfully!");
                        } else {
                            console.log(err)
                        }
                    });

                    ftp.on('error', () => {

                    });

                } catch (err) {
                    console.log(err);
                    throw new Error;
                }
            }
            await sequelize.query(`DELETE INTRA_ponto where id = ${id}`);
            return res.json();
        } catch (err) {
            console.log(err);
            return res.status(400).json();
        }
    }


    /**
    * Atualiza o ponto
    * @param {object} req.body Dados a serem alterados pelo ponto 
    * @return {object} retorna sucesso ou erro
    */
    async AtualizarPonto(req, res) {
        const upload = multer(multerConfig).array('arquivos');
        return upload(req, res, async (error) => {
            if (error) console.log(error)
            try {

                const { id, idFuncionario, date, idGestor, item, justificativa, periodoDe, periodoAte,
                    horas } = req.body;
                await PontoController.insertFiles(req, id);
                await sequelize.query(`UPDATE INTRA_Ponto set data = '${date}' , item = '${item}' , periodo_de = '${periodoDe}' , periodo_ate = '${periodoAte}' , motivoRecusado = null, horas = '${horas}' , justificativa = '${justificativa}', status = 1 where id = ${id} `);
                return res.json();
            } catch (err) {
                console.log(err);
                return res.status(400).json();
            }
        })

    }



    /**
    * Deleta um arquivo do FTP
    * @param {object} req.body Dados do FTP e do arquivo que irá ser deletado 
    * @return {void}
    */
    static async deleteFile(id, nome) {
        try {
            const ftp = new jsftp({
                host: 'suporte.asplan.com.br',
                user: 'asplan',
                pass: '4spl4n*',
                port: 21
            });

            await ftp.raw('dele', `httpdocs/intranet/anexos/${id}/${nome}`, (err) => {
                if (!err) {
                    console.log("File delete successfully!");
                } else {
                    console.log(err)
                }
            });

            ftp.on('error', () => {

            });

        } catch (err) {
            throw new Error;
        }



    }


    /**
    * Rota que chama o arquivo que deve ser deletado do ponto e chama a função que deleta do FTP
    * @param {object} req.body Dados do ponto e do arquivo que ira ser delatado
    * @return {object} retorna sucesso ou erro
    */
    async DeletarArquivo(req, res) {
        try {
            const { id, nome, idponto } = req.body
            await sequelize.query(` DELETE FROM Intra_anexoponto where id = ${id} `);
            await PontoController.deleteFile(idponto, nome);
            return res.json();
        } catch (err) {
            console.log(err);
            return res.status(400).json()
        }
    }
}


module.exports = new PontoController()