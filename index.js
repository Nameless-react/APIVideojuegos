import config from "./config/config.js";
import express from "express";
import connection from "./db/connection.js";


const app = express();
app.use(express.json());
const connect = connection();



app.listen(config.port, () => {
    console.log(`El servidor está corriendo en el puerto http://localhost:${config.port}`);   
})