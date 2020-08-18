const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

// crea una nueva tarea
exports.crearTarea = async (req, res) => {
  //revisar si hay errores en la validacion con express validator
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  try {
    // extraer proyecto & comprobar que exista
    const { proyecto } = req.body;
    const proyectoExiste = await Proyecto.findById(proyecto);

    if (!proyectoExiste) {
      return res.status(404).json({ msg: "proyecto no encontrado" });
    }

    // verificar si es el creador del proyecto
    if (proyectoExiste.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    // crear tarea
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("hubo un error en el servidor");
  }
};

// obtiene tareas de un proyecto

exports.obtenerTareas = async (req, res) => {
  try {
    // req.query cuando pasamos {params:{query}}
    const { proyecto } = req.query;
    const proyectoExiste = await Proyecto.findById(proyecto);

    if (!proyectoExiste) {
      return res.status(404).json({ msg: "proyecto no encontrado" });
    }

    // verificar si es el creador del proyecto
    if (proyectoExiste.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    const tareas = await Tarea.find({ proyecto }).sort({
      creado: -1,
    });
    res.json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).send("hubo un error en el servidor");
  }
};

// actualizar
exports.actualizarTarea = async (req, res) => {
  try {
    // extraemos el body que se pasa a la peticion
    const { proyecto, nombre, estado } = req.body;

    // revisar si la tarea existe
    let tarea = await Tarea.findById(req.params.id);

    if (!tarea) return res.status(404).json({ msg: "tarea no encontrada" });

    // extraer proyecto
    const proyectoExiste = await Proyecto.findById(proyecto);

    // verificar si es el creador del proyecto
    if (proyectoExiste.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    // crear una nueva tarea
    const nuevaTarea = {};
    nuevaTarea.nombre = nombre;
    nuevaTarea.estado = estado;

    // guardar la tarea
    tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, {
      new: true,
    });
    res.status(200).json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

// Elimina
exports.eliminarTarea = async (req, res) => {
  try {
    const { proyecto } = req.query;

    let tarea = await Tarea.findById(req.params.id);

    if (!tarea) return res.status(404).json({ msg: "Tarea no encontrada" });

    const proyectoExiste = await Proyecto.findById(proyecto);

    if (proyectoExiste.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    await Tarea.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "tarea eliminada" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
