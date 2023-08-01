const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, (req, res) => {
  productosController.agregar(req, res);
});

router.get('/', authMiddleware, (req, res) => {
  productosController.listar(req, res);
});

router.get('/vista', authMiddleware, async (req, res) => {
  try {
    const productos = await productosController.obtenerProductos(req);
    res.render('productos', { productos });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/:id', authMiddleware, (req, res) => {
  productosController.obtenerPorId(req, res);
});

router.put('/:id', authMiddleware, (req, res) => {
  productosController.editar(req, res);
});

router.delete('/:id', authMiddleware, (req, res) => {
  productosController.eliminar(req, res);
});

module.exports = router;