const express = require('express');
const usuariosController = require('../controllers/usuariosController');

const router = express.Router();

router.post('/register', usuariosController.registrarUsuario);
router.post('/login', usuariosController.iniciarSesion);

module.exports = router;