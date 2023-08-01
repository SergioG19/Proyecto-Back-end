const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, (req, res) => {
  reportesController.agregar(req, res);
});

router.get('/', authMiddleware, (req, res) => {
  reportesController.listar(req, res);
});

router.get('/vista', authMiddleware, async (req, res) => {
  try {
    const reportes = await reportesController.obtenerReportes(req);
    res.render('reportes', { reportes });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/:id', authMiddleware, (req, res) => {
  reportesController.obtenerPorId(req, res);
});

router.put('/:id', authMiddleware, (req, res) => {
  reportesController.editar(req, res);
});

router.delete('/:id', authMiddleware, (req, res) => {
  reportesController.eliminar(req, res);
});

module.exports = router;