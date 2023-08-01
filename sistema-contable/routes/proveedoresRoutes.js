const express = require('express');
const router = express.Router();
const proveedoresController = require('../controllers/proveedoresController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, (req, res) => {
  proveedoresController.agregar(req, res);
});

router.get('/', authMiddleware, (req, res) => {
  proveedoresController.listar(req, res);
});

router.get('/vista', authMiddleware, async (req, res) => {
  try {
    const proveedores = await proveedoresController.obtenerProveedores(req);
    res.render('proveedores', { proveedores });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/:id', authMiddleware, (req, res) => {
  proveedoresController.obtenerPorId(req, res);
});

router.put('/:id', authMiddleware, (req, res) => {
  proveedoresController.editar(req, res);
});

router.delete('/:id', authMiddleware, (req, res) => {
  proveedoresController.eliminar(req, res);
});

module.exports = router;