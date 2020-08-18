const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

exports.crearProyecto = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  try {
    // crear nuevo proyecto
    const proyecto = new Proyecto(req.body);

    /* guardar el creador via jwt --> el req.usuario viene del middleware auth,
      recordemos que req.usuario es un objeto que guardar el cifrado del middleware que hicimos.
      asi de ese modo accedemos al id del usuario.
      */

    proyecto.creador = req.usuario.id;
    // guardar proyecto
    proyecto.save();
    res.json(proyecto);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error con el servidor");
  }
};

// Obtiene proyectos de un usuario actual en concreto
exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({
      creado: -1,
    });
    res.json({ proyectos });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

// actualiza un proyecto
exports.actualizarProyecto = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const { nombre } = req.body;
  const nuevoProyecto = {};

  if (nombre) {
    nuevoProyecto.nombre = nombre;
  }

  try {
    // revisar el id
    let proyecto = await Proyecto.findById(req.params.id);
    // revisar si el proyecto existe
    if (!proyecto) {
      return res.status(404).json({ msg: "proyecto no encontrado" });
    }

    // verificar si es el creador del proyecto
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    // actualizar proyecto
    proyecto = await Proyecto.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: nuevoProyecto },
      { new: true }
    );

    res.json({ proyecto });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};

// Elimina un proyecto por su id
exports.eliminarProyecto = async (req, res) => {
  try {
    let proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
      return res.status(404).json({ msg: "proyecto no encontrado" });
    }

    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    // eliminar el proyecto
    await Proyecto.findOneAndRemove({_id: req.params.id});
    res.json({msg:'proyecto eliminado'});


  } catch (error) {
    console.log(error);
    res.status(500).send('Error en el servidor');
  }
};
