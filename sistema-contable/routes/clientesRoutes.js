const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware,(req, res) => {
  clientesController.agregar(req, res);
});

router.get('/', authMiddleware, (req, res) => {
  clientesController.listar(req, res);
});

router.get('/vista', authMiddleware, async (req, res) => {
  try {
    const clientes = await clientesController.obtenerClientes(req);
    res.render('clientes', { clientes });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.get('/:id', authMiddleware, (req, res) => {
  clientesController.obtenerPorId(req, res);
});

router.put('/:id', authMiddleware, (req, res) => {
  clientesController.editar(req, res);
});

router.delete('/:id', authMiddleware, (req, res) => {
  clientesController.eliminar(req, res);
});

module.exports = router;