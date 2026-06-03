import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./src/routes/messageRoutes.js";
import { initializeDatabase, pool } from "./src/database/db.js";
dotenv.config();
//Crear el Servidor de express
const app = express();
//Directorio Publico
app.use(express.static("public"));
//Cors
app.use(cors());
app.use(express.json());
//Rutas
app.use("/messages", routes);
//Escuchar peticiones
app.listen(process.env.PORT, async () => {
    console.log(`Servidor corriendo en el Servidor ${process.env.PORT}`);
    await initializeDatabase();
});
//# sourceMappingURL=index.js.map