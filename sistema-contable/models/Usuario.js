const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  password: String,
  role: { type: String, enum: ['contador', 'facturador', 'empleador', 'administrador', 'almacenista'] }
});

// Método para cifrar la contraseña antes de guardar el usuario
usuarioSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('Usuario', usuarioSchema);