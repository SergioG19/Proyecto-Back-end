const mongoose = require('mongoose');

const EmpleadoSchema = new mongoose.Schema({
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
  },
  puesto: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  }
});

const Empleado = mongoose.model('Empleado', EmpleadoSchema);

class EmpleadosController {
  static async agregar(req, res) {
    try {
      if (req.user.role !== 'facturador') {
        return res.status(403).send('Acceso denegado');
      }

      const nuevoEmpleado = new Empleado(req.body);
      const resultado = await nuevoEmpleado.save();
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
      const puesto = req.query.puesto || '';
      const skip = (page - 1) * pageSize;
      const empleados = await Empleado.find({ puesto: { $regex: puesto, $options: 'i' } })
        .skip(skip)
        .limit(pageSize);
  
      res.send(empleados);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async obtenerEmpleados(req) {
    if (!req.user || req.user.role !== 'facturador') {
      throw new Error('Acceso denegado');
    }

    const empleados = await Empleado.find();
    return empleados;
  }

  static async editar(req, res) {
    try {
      if (req.user.role !== 'facturador') {
        return res.status(403).send('Acceso denegado');
      }

      const empleado = await Empleado.findById(req.params.id);
      if (!empleado) {
        return res.status(404).send();
      }

      if (req.body.nombre) {
        empleado.nombre = req.body.nombre;
      }

      if (req.body.email) {
        empleado.email = req.body.email;
      }

      if (req.body.puesto) {
        empleado.puesto = req.body.puesto;
      }

      const resultado = await empleado.save();
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

      const empleado = await Empleado.findByIdAndDelete(req.params.id);
      if (!empleado) {
        return res.status(404).send();
      }
      res.send(empleado);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async obtenerPorId(req, res) {
    try {
      if (req.user.role !== 'facturador') {
        return res.status(403).send('Acceso denegado');
      }

      const empleado = await Empleado.findById(req.params.id);
      if (!empleado) {
        return res.status(404).send();
      }
      res.send(empleado);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = EmpleadosController;