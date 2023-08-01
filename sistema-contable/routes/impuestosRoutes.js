const express = require('express');
const router = express.Router();
const impuestosController = require('../controllers/impuestosController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, (req, res) => {
  impuestosController.agregar(req, res);
});

router.get('/', authMiddleware, (req, res) => {
  impuestosController.listar(req, res);
});

router.get('/vista', authMiddleware, async (req, res) => {
  try {
    const impuestos = await impuestosController.obtenerImpuestos(req);
    res.render('impuestos', { impuestos });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/:id', authMiddleware, (req, res) => {
  impuestosController.obtenerPorId(req, res);
});

router.put('/:id', authMiddleware, (req, res) => {
  impuestosController.editar(req, res);
});

router.delete('/:id', authMiddleware, (req, res) => {
  impuestosController.eliminar(req, res);
});

module.exports = router;