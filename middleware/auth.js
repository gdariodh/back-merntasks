const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // leer token del header - revisar si se pasa el x-auth-token por el header
  // tenemos que pasar el token por el header en el metodo post
  const token = req.header("x-auth-token");

  // revisar si no hay token
  if (!token) {
    return res.status(401).json({ msg: "No hay token, permiso no valido!" });
  }
  // validar el token
  try {
    // verificamos token - pasamos el token y la palabra secreta
    const cifrado = jwt.verify(token, process.env.SECRETA);
    /** agregamos a la peticion el objeto req.usuario que va a guardar la info o objeto del token de usuario,
     * por eso escribimos cifrado.usuario, ya que en el payload del token, tenemos el objeto usuario!
     */
    req.usuario = cifrado.usuario;
    // invocamos next para dar de alta el middleware
    next();
  } catch (error) {
    res.status(401).json({ msg: "token no valido" });
  }
};
