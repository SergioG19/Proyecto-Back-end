const mongoose = require('mongoose');

const ImpuestoSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  tasa: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
});

const Impuesto = mongoose.model('Impuesto', ImpuestoSchema);

class ImpuestosController {
  static async agregar(req, res) {
    try {
      if (req.user.role !== 'facturador') {
        return res.status(403).send('Acceso denegado');
      }

      const nuevoImpuesto = new Impuesto(req.body);
      const resultado = await nuevoImpuesto.save();
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
        const nombre = req.query.nombre || '';
        const skip = (page - 1) * pageSize;
        const impuestos = await Impuesto.find({ nombre: { $regex: nombre, $options: 'i' } })
          .skip(skip)
          .limit(pageSize);
    
        res.send(impuestos);
      } catch (error) {
        res.status(500).send(error);
      }
    }

  static async obtenerImpuestos(req) {
    if (!req.user || req.user.role !== 'facturador') {
      throw new Error('Acceso denegado');
    }

    const impuestos = await Impuesto.find();
    return impuestos;
  }

  static async editar(req, res) {
    try {
      if (req.user.role !== 'facturador') {
        return res.status(403).send('Acceso denegado');
      }

      const impuesto = await Impuesto.findById(req.params.id);
      if (!impuesto) {
        return res.status(404).send();
      }

      if (req.body.nombre) {
        impuesto.nombre = req.body.nombre;
      }

      if (req.body.tasa) {
        impuesto.tasa = req.body.tasa;
      }

      const resultado = await impuesto.save();
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

      const impuesto = await Impuesto.findByIdAndDelete(req.params.id);
      if (!impuesto) {
        return res.status(404).send();
      }
      res.send(impuesto);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async obtenerPorId(req, res) {
    try {
      if (req.user.role !== 'facturador') {
        return res.status(403).send('Acceso denegado');
      }

      const impuesto = await Impuesto.findById(req.params.id);
      if (!impuesto) {
        return res.status(404).send();
      }

      res.send(impuesto);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = ImpuestosController;