// importamos express
const express = require("express");
// importamos la conexion a la base de datos
const conectarDB = require("./config/db");
// importamos cors x los permisos
const cors = require('cors');
// crear el servidor
const app = express();
// conectar a la base de datos
conectarDB();
// habilitar cors
app.use(cors());
// habilitar express.json - otra forma bodyparser
app.use(express.json({ extended: true }));
// puerto de la app
const port = process.env.port || 4000;
// importar rutas
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/proyectos", require("./routes/proyectos"));
app.use("/api/tareas",require("./routes/tareas"));
// arracar la app
app.listen(port, '0.0.0.0',() => {
  console.log(`El servidor esta corriendo en el puerto ${port}`);
});
