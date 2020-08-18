// rutas para crear usuarios
const express = require("express");
const router = express.Router();
const {check} = require('express-validator'); 
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// usuario inicia sesion - /api/auth
router.post("/", 
   [
       check('email','Agrega un email').isEmail(),
       check('password','El password debe tener al menos 6 caracteres').isLength({min:6})
   ],
   authController.autenticarUsuario);

   // obtiene el usuario autenticado
   router.get(
       "/",
       auth,
       authController.usuarioAuth
   )

module.exports = router;
