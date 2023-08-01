const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
  }
});

const Cliente = mongoose.model('Cliente', ClienteSchema);

class ClientesController {
  static async agregar(req, res) {
    try {
      if (req.user.role !== 'contador') {
        return res.status(403).send('Acceso denegado');
      }

      const nuevoCliente = new Cliente(req.body);
      const resultado = await nuevoCliente.save();
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
      const nombre = req.query.nombre || '';
      const skip = (page - 1) * pageSize;
      const clientes = await Cliente.find({ nombre: { $regex: nombre, $options: 'i' } })
        .skip(skip)
        .limit(pageSize);

  
      res.send(clientes);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async obtenerClientes(req) {
    if (!req.user || req.user.role !== 'contador') {
      throw new Error('Acceso denegado');
    }

    const clientes = await Cliente.find();
    return clientes;
  }

  static async editar(req, res) {
    try {
      if (req.user.role !== 'contador') {
        return res.status(403).send('Acceso denegado');
      }

      const cliente = await Cliente.findById(req.params.id);
      if (!cliente) {
        return res.status(404).send();
      }

      if (req.body.nombre) {
        cliente.nombre = req.body.nombre;
      }

      if (req.body.email) {
        cliente.email = req.body.email;
      }

      const resultado = await cliente.save();
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

      const cliente = await Cliente.findByIdAndDelete(req.params.id);
      if (!cliente) {
        return res.status(404).send();
      }
      res.send(cliente);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async obtenerPorId(req, res) {
    try {
      if (req.user.role !== 'contador') {
        return res.status(403).send('Acceso denegado');
      }

      const cliente = await Cliente.findById(req.params.id);
      if (!cliente) {
        return res.status(404).send();
      }

      res.send(cliente);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = ClientesController;