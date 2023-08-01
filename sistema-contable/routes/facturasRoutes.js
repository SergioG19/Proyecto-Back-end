const express = require('express');
const router = express.Router();
const facturasController = require('../controllers/facturasController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/vista', authMiddleware, (req, res) => {
    res.render('facturas');
});

router.post('/', authMiddleware, (req, res) => {
  facturasController.agregar(req, res);
});

router.get('/', authMiddleware, (req, res) => {
  const facturas = facturasController.listar();
  res.json(facturas);
});

router.get('/vista', authMiddleware, async (req, res) => {
  try {
    const facturas = await facturasController.obtenerFacturas(req);
    res.render('facturas', { facturas });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/:id', authMiddleware, (req, res) => {
  facturasController.obtenerPorId(req, res);
});

router.put('/:id', authMiddleware, (req, res) => {
  facturasController.editar(req, res);
});

router.delete('/:id', authMiddleware, (req, res) => {
  facturasController.eliminar(req, res);
});

module.exports = router;