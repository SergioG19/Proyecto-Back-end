const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
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
  precio: {
    type: Number,
    required: true,
    min: 0
  }
});

const Producto = mongoose.model('Producto', ProductoSchema);

class ProductosController {
  static async agregar(req, res) {
    try {
      if (req.user.role !== 'contador') {
        return res.status(403).send('Acceso denegado');
      }

      const nuevoProducto = new Producto(req.body);
      const resultado = await nuevoProducto.save();
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
      const productos = await Producto.find({ nombre: { $regex: nombre, $options: 'i' } })
        .skip(skip)
        .limit(pageSize);

      res.send(productos);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async obtenerProductos(req) {
    if (!req.user || req.user.role !== 'contador') {
      throw new Error('Acceso denegado');
    }

    const productos = await Producto.find();
    return productos;
  }

  static async editar(req, res) {
    try {
      if (req.user.role !== 'contador') {
        return res.status(403).send('Acceso denegado');
      }

      const producto = await Producto.findById(req.params.id);;
      if (!producto) {
        return res.status(404).send();
      }

      if (req.body.nombre) {
        producto.nombre = req.body.nombre;
      }

      if (req.body.precio) {
        producto.precio = req.body.precio;
      }

      const resultado = await producto.save();
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

      const producto = await Producto.findByIdAndDelete(req.params.id);
      if (!producto) {
        return res.status(404).send();
      }
      res.send(producto);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async obtenerPorId(req, res) {
    try {
      if (req.user.role !== 'contador') {
        return res.status(403).send('Acceso denegado');
      }

      const producto = await Producto.findById(req.params.id);
      if (!producto) {
        return res.status(404).send();
      }

      res.send(producto);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = ProductosController;