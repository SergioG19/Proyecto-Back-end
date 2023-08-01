const mongoose = require('mongoose');

const InventarioSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 0
  },
});

const Inventario = mongoose.model('Inventario', InventarioSchema);

class InventarioController {
  static async agregar(req, res) {
    try {
      if (req.user.role !== 'contador') {
        return res.status(403).send('Acceso denegado');
      }

      const nuevoInventario = new Inventario(req.body);
      const resultado = await nuevoInventario.save();
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
        if (!req.user || req.user.role !== 'contador') {
          return res.status(403).send('Acceso denegado');
        }
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const producto = req.query.producto || '';
        const skip = (page - 1) * pageSize;
        const inventario = await Inventario.find({ producto: { $regex: producto, $options: 'i' } })
          .skip(skip)
          .limit(pageSize);
  
        res.send(inventario);
      } catch (error) {
        res.status(500).send(error);
      }
    }

  static async obtenerPorId(req, res) {
    try {
      if (req.user.role !== 'contador') {
        return res.status(403).send('Acceso denegado');
      }

      const inventario = await Inventario.findById(req.params.id).populate('producto');
      if (!inventario) {
        return res.status(404).send();
      }

      res.send(inventario);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async editar(req, res) {
    try {
      if (req.user.role !== 'contador') {
        return res.status(403).send('Acceso denegado');
      }

      const inventario = await Inventario.findById(req.params.id).populate('producto');
      if (!inventario) {
        return res.status(404).send();
      }

      if (req.body.cantidad != null) {
        inventario.cantidad = req.body.cantidad;
      }

      const resultado = await inventario.save();
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
      if (req.user.role !== 'contador') {
        return res.status(403).send('Acceso denegado');
      }

      const inventario = await Inventario.findByIdAndDelete(req.params.id);
      if (!inventario) {
        return res.status(404).send();
      }
      
      res.send(inventario);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = InventarioController;