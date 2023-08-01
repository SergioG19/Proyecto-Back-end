const mongoose = require('mongoose');

const ProveedorSchema = new mongoose.Schema({
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

const Proveedor = mongoose.model('Proveedor', ProveedorSchema);

class ProveedoresController {
  static async agregar(req, res) {
    try {
      if (req.user.role !== 'facturador') {
        return res.status(403).send('Acceso denegado');
      }

      const nuevoProveedor = new Proveedor(req.body);
      const resultado = await nuevoProveedor.save();
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
      const proveedores = await Proveedor.find({ nombre: { $regex: nombre, $options: 'i' } })
        .skip(skip)
        .limit(pageSize);
  
      res.send(proveedores);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async obtenerProveedores(req) {
    if (!req.user || req.user.role !== 'facturador') {
      throw new Error('Acceso denegado');
    }

    const proveedores = await Proveedor.find();
    return proveedores;
  }

  static async editar(req, res) {
    try {
      if (req.user.role !== 'facturador') {
        return res.status(403).send('Acceso denegado');
      }

      const proveedor = await Proveedor.findById(req.params.id);
      if (!proveedor) {
        return res.status(404).send();
      }

      if (req.body.nombre) {
        proveedor.nombre = req.body.nombre;
      }

      if (req.body.email) {
        proveedor.email = req.body.email;
      }

      const resultado = await proveedor.save();
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

      const proveedor = await Proveedor.findByIdAndDelete(req.params.id);
      if (!proveedor) {
        return res.status(404).send();
      }
      res.send(proveedor);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async obtenerPorId(req, res) {
    try {
      if (req.user.role !== 'facturador') {
        return res.status(403).send('Acceso denegado');
      }

      const proveedor = await Proveedor.findById(req.params.id);
      if (!proveedor) {
        return res.status(404).send();
      }

      res.send(proveedor);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = ProveedoresController;