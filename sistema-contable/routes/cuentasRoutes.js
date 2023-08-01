const express = require('express');
const router = express.Router();
const CuentasController = require('../controllers/cuentasController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, (req, res) => {
  CuentasController.agregar(req, res);
});

router.get('/', authMiddleware, (req, res) => {
  CuentasController.listar(req, res);
});

router.get('/vista', authMiddleware, async (req, res) => {
  try {
    const cuentas = await CuentasController.obtenerCuentas(req);
    res.render('cuentas', { cuentas });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/:id', authMiddleware, (req, res) => {
  CuentasController.obtenerPorId(req, res);
});

router.put('/:id', authMiddleware, (req, res) => {
  CuentasController.editar(req, res);
});

router.delete('/:id', authMiddleware, (req, res) => {
  CuentasController.eliminar(req, res);
});


module.exports = router;