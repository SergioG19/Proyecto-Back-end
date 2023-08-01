const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, (req, res) => {
  pedidosController.agregar(req, res);
});

router.get('/', authMiddleware, (req, res) => {
  pedidosController.listar(req, res);
});

router.get('/vista', authMiddleware, async (req, res) => {
  try {
    const pedidos = await pedidosController.obtenerPedidos(req);
    res.render('pedidos', { pedidos });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/:id', authMiddleware, (req, res) => {
  pedidosController.obtenerPorId(req, res);
});

router.put('/:id', authMiddleware, (req, res) => {
  pedidosController.editar(req, res);
});

router.delete('/:id', authMiddleware, (req, res) => {
  pedidosController.eliminar(req, res);
});

module.exports = router;