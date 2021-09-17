const express = require('express');
const pontoController = require('../controllers/pontoController');
const { Router } = express;
const router = new Router();



router.post('/info-user', pontoController.getInfoUser);
router.post('/pontos-user', pontoController.getPontosUser);
router.post('/salva', pontoController.SavePonto);
router.post('/delete', pontoController.DeletePonto);
router.post('/files', pontoController.getFiles);
router.patch('/', pontoController.AtualizarPonto);
router.post('/delete-file', pontoController.DeletarArquivo);

module.exports = router