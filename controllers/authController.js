const Usuario = require("../models/Usuario"); //modelo
const bcryptjs = require("bcryptjs"); // libreria de password
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

// api/auth

exports.autenticarUsuario = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  // extraer email y password
  const { email, password } = req.body;

  try {
    // verificar si el correo que ingresa existe y es valido
    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: "usuario no existe" });
    }
    // si existe el usuario, revisar su password
    const passCorrecto = await bcryptjs.compare(password, usuario.password);
    if (!passCorrecto) {
      return res.status(400).json({ msg: "password incorrecto" });
    }
    // si todo esta bien hacemos el jwt!
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };
    // firmar jwt
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600, // 1hora
      },
      (error, token) => {
        if (error) throw error;
        // mensaje de exito
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// obtiene que usuario esta autenticado
exports.usuarioAuth = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    res.json({ usuario });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};
