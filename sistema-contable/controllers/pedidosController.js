const mongoose = require('mongoose');

const ProductoPedidoSchema = new mongoose.Schema({
  productoId: {
    type: Number,
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1,
  },
}, { _id : false });

const PedidoSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  clienteId: {
    type: Number,
    required: true,
  },
  productos: {
    type: [ProductoPedidoSchema],
    required: true,
    validate: [arrayLimit, '{PATH} debe contener al menos 1 producto']
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  fecha: {
    type: Date,
    default: Date.now
  },
});

function arrayLimit(val) {
  return val.length > 0;
}

const Pedido = mongoose.model('Pedido', PedidoSchema);

class PedidosController {
  static async agregar(req, res) {
    try {
      if (req.user.role !== 'facturador') {
        return res.status(403).send('Acceso denegado');
      }

      const nuevoPedido = new Pedido(req.body);
      const resultado = await nuevoPedido.save();
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
      const clienteId = req.query.clienteId || '';
      const skip = (page - 1) * pageSize;
      const pedidos = await Pedido.find({ clienteId: { $regex: clienteId, $options: 'i' } })
        .skip(skip)
        .limit(pageSize);
  
      res.send(pedidos);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async obtenerPedidos(req) {
    if (!req.user || req.user.role !== 'facturador') {
      throw new Error('Acceso denegado');
    }

    const pedidos = await Pedido.find();
    return pedidos;
  }

  static async obtenerPorId(req, res) {
    try {
      if (req.user.role !== 'facturador') {
        return res.status(403).send('Acceso denegado');
      }

      const pedido = await Pedido.findById(req.params.id);
      if (!pedido) {
        return res.status(404).send();
      }
      res.send(pedido);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async editar(req, res) {
    try {
      if (req.user.role !== 'facturador') {
        return res.status(403).send('Acceso denegado');
      }

      const pedido = await Pedido.findById(req.params.id);
      if (!pedido) {
        return res.status(404).send();
      }

      if (req.body.id) {
        pedido.id = req.body.id;
      }

      if (req.body.clienteId) {
        pedido.clienteId = req.body.clienteId;
      }

      if (req.body.productos) {
        pedido.productos = req.body.productos;
      }

      if (req.body.total) {
        pedido.total = req.body.total;
      }

      if (req.body.fecha) {
        pedido.fecha = req.body.fecha;
      }

      const resultado = await pedido.save();
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

      const pedido = await Pedido.findByIdAndDelete(req.params.id);
      if (!pedido) {
        return res.status(404).send();
      }
      res.send(pedido);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = PedidosController;