const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.registrarUsuario = async (req, res) => {
  const usuario = new Usuario(req.body);
  await usuario.save();
  res.status(201).send('Usuario registrado con éxito');
};

exports.iniciarSesion = async (req, res) => {
  const usuario = await Usuario.findOne({ email: req.body.email });
  if (!usuario) {
    return res.status(400).send('Usuario no encontrado');
  }
  const isValidPassword = await bcrypt.compare(req.body.password, usuario.password);
  if (isValidPassword) {
    const token = jwt.sign({ id: usuario.id, role: usuario.role }, process.env.SECRET_KEY);
    res.json({ token });
  } else {
    res.status(401).send('Contraseña incorrecta');
  }
};