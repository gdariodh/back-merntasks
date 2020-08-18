const express = require("express");
const router = express.Router();
const proyectoController = require("../controllers/proyectoController");
const auth = require("../middleware/auth"); // middleware
const { check } = require("express-validator");

// api/proyectos - routing de proyectos
// crea proyecto
router.post(
  "/",
  auth,
  [check("nombre", "El nombre del proyecto es obligatorio").not().isEmpty()],
  proyectoController.crearProyecto
);

// obtiene proyecto de un usuario
router.get("/", auth, proyectoController.obtenerProyectos);

// actualiza proyecto de usuario en concecreto via id
router.put(
  "/:id",
  auth,
  [check("nombre", "El nombre del proyecto es obligatorio").not().isEmpty()],
  proyectoController.actualizarProyecto
);

// elimina un proyecto
router.delete(
  "/:id",
  auth,
  proyectoController.eliminarProyecto
);

module.exports = router;
