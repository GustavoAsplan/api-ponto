const express = require('express');
const gestaoController = require('../controllers/gestaoController');
const { Router } = express;
const router = new Router();



router.post('/', gestaoController.getPontos);
router.post('/files', gestaoController.getFiles);

module.exports = router