const mongoose = require('mongoose');

const CuentaSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  tipo: {
    type: String,
    enum: ['ahorro', 'corriente'],
    required: true
  }
});

const Cuenta = mongoose.model('Cuenta', CuentaSchema);

class CuentasController {
  static async agregar(req, res) {
    try {
      if (req.user.role !== 'facturador') {
        return res.status(403).send('Acceso denegado');
      }

      const nuevaCuenta = new Cuenta(req.body);
      const resultado = await nuevaCuenta.save();
      res.status(201).send(resultado);
    } catch (error) {
      if (error.name === 'ValidationError') {
        res.status(400).send(error.message);
      } else {
        res.status(500).send(error);
      }
    }
  }

  static async listar(req, res) {
    try {
      if (!req.user || req.user.role !== 'facturador') {
        return res.status(403).send('Acceso denegado');
      }
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const tipo = req.query.tipo || '';
      const skip = (page - 1) * pageSize;
      const cuentas = await Cuenta.find({ tipo: { $regex: tipo, $options: 'i' } })
        .skip(skip)
        .limit(pageSize);

  
      res.send(cuentas);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async obtenerCuentas(req) {
    if (!req.user || req.user.role !== 'facturador') {
      throw new Error('Acceso denegado');
    }

    const cuentas = await Cuenta.find();
    return cuentas;
  }

  static async editar(req, res) {
    try {
      if (req.user.role !== 'facturador') {
        return res.status(403).send('Acceso denegado');
      }

      const cuenta = await Cuenta.findById(req.params.id);
      if (!cuenta) {
        return res.status(404).send();
      }

      if (req.body.nombre) {
        cuenta.nombre = req.body.nombre;
      }

      if (req.body.tipo) {
        cuenta.tipo = req.body.tipo;
      }

      const resultado = await cuenta.save();
      res.send(resultado);
    } catch (error) {
      if (error.name === 'ValidationError') {
        res.status(400).send(error.message);
      } else {
        res.status(500).send(error);
      }
    }
  }

  static async eliminar(req, res) {
    try {
      if (req.user.role !== 'facturador') {
        return res.status(403).send('Acceso denegado');
      }

      const cuenta = await Cuenta.findByIdAndDelete(req.params.id);
      if (!cuenta) {
        return res.status(404).send();
      }
      res.send(cuenta);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async obtenerPorId(req, res) {
    try {
      if (req.user.role !== 'facturador') {
        return res.status(403).send('Acceso denegado');
      }

      const cuenta = await Cuenta.findById(req.params.id);
      if (!cuenta) {
        return res.status(404).send();
      }

      res.send(cuenta);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = CuentasController;