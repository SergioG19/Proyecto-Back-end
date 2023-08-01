const mongoose = require('mongoose');

const ReporteSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  titulo: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  fecha: {
    type: Date,
    required: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  autor: {
    type: String,
    required: true,
    trim: true
  }
});

const Reporte = mongoose.model('Reporte', ReporteSchema);

class ReportesController {
  static async agregar(req, res) {
    try {
      if (req.user.role !== 'facturador') {
        return res.status(403).send('Acceso denegado');
      }

      const nuevoReporte = new Reporte(req.body);
      const resultado = await nuevoReporte.save();
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
        const fecha = req.query.fecha || '';
        const skip = (page - 1) * pageSize;
        const reportes = await Reporte.find({ fecha: { $regex: fecha, $options: 'i' } })
          .skip(skip)
          .limit(pageSize);
    
        res.send(reportes);
      } catch (error) {
        res.status(500).send(error);
      }
    }

  static async obtenerReportes(req) {
    if (!req.user || req.user.role !== 'facturador') {
      throw new Error('Acceso denegado');
    }

    const reportes = await Reporte.find();
    return reportes;
  }

  static async editar(req, res) {
    try {
      if (req.user.role !== 'facturador') {
        return res.status(403).send('Acceso denegado');
      }
  
      const reporte = await Reporte.findById(req.params.id);
      if (!reporte) {
        return res.status(404).send();
      }
  
      if (req.body.titulo) {
        reporte.titulo = req.body.titulo;
      }
  
      if (req.body.fecha) {
        reporte.fecha = req.body.fecha;
      }
  
      if (req.body.descripcion) {
        reporte.descripcion = req.body.descripcion;
      }
  
      if (req.body.autor) {
        reporte.autor = req.body.autor;
      }
  
      const resultado = await reporte.save();
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

      const reporte = await Reporte.findByIdAndDelete(req.params.id);
      if (!reporte) {
        return res.status(404).send();
      }
      res.send(reporte);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async obtenerPorId(req, res) {
    try {
      if (req.user.role !== 'facturador') {
        return res.status(403).send('Acceso denegado');
      }

      const reporte = await Reporte.findById(req.params.id);
      if (!reporte) {
        return res.status(404).send();
      }

      res.send(reporte);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = ReportesController;