// rutas para crear usuarios
const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const {check} = require('express-validator'); // validacion de express 
// las reglas en el routing osea routes y el resultado en el controllador 

// crea un usuario --> api/usuarios
router.post("/", 
   [
       check('nombre','El nombre es obligatorio').not().isEmpty(),
       check('email','Agrega un email').isEmail(),
       check('password','El password debe tener al menos 6 caracteres').isLength({min:6})
   ],
usuarioController.crearUsuario);

module.exports = router;
