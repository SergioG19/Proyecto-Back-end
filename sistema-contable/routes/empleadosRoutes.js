const express = require('express');
const router = express.Router();
const empleadosController = require('../controllers/empleadosController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, (req, res) => {
  empleadosController.agregar(req, res);
});

router.get('/', authMiddleware, (req, res) => {
  empleadosController.listar(req, res);
});

router.get('/vista', authMiddleware, async (req, res) => {
  try {
    const empleados = await empleadosController.obtenerEmpleados(req);
    res.render('empleados', { empleados });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/:id', authMiddleware, (req, res) => {
  empleadosController.obtenerPorId(req, res);
});

router.put('/:id', authMiddleware, (req, res) => {
  empleadosController.editar(req, res);
});

router.delete('/:id', authMiddleware, (req, res) => {
  empleadosController.eliminar(req, res);
});

module.exports = router;