const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, (req, res) => {
  inventarioController.agregar(req, res);
});

router.get('/', authMiddleware, (req, res) => {
  inventarioController.listar(req, res);
});

router.get('/vista', authMiddleware, async (req, res) => {
  try {
    const inventario = await inventarioController.obtenerInventario(req);
    res.render('inventario', { inventario });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/:id', authMiddleware, (req, res) => {
  inventarioController.obtenerPorId(req, res);
});

router.put('/:id', authMiddleware, (req, res) => {
  inventarioController.editar(req, res);
});

router.delete('/:id', authMiddleware, (req, res) => {
  inventarioController.eliminar(req, res);
});

module.exports = router;