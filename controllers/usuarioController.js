const Usuario = require("../models/Usuario"); //modelo
const bcryptjs = require("bcryptjs"); // libreria de password
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.crearUsuario = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const { email, password } = req.body;

  try {
    // revisar que el usuario registrado sea unico
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }
    // crea el nuevo usuario
    usuario = new Usuario(req.body);

    // hashear password
    const salt = await bcryptjs.genSalt(10); // mas salt, mas consumira del servidor
    usuario.password = await bcryptjs.hash(password, salt);

    // guardamos el nuevo usuario
    await usuario.save();

    // crear y firmar jwt - payload --> info o objeto que guarda el jwt
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
    res.status(400).send("Hubo un error");
  }
};
