const express = require('express');
const pontoController = require('../controllers/pontoController');
const { Router } = express;
const router = new Router();



router.get('/', pontoController.getBD);
module.exports = router