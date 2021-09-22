const express = require('express');
const gestaoController = require('../controllers/gestaoController');
const { Router } = express;
const router = new Router();



router.post('/', gestaoController.getPontos);
router.post('/files', gestaoController.getFiles);
router.post('/recusar', gestaoController.recusarPonto);
router.post('/aprovar', gestaoController.aprovarPonto);
router.post('/aprovados', gestaoController.getPontosAprovados);

module.exports = router