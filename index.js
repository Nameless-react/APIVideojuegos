import config from "./config/config.js";
import express from "express";
import connection from "./db/connection.js";
import userRouter from "./routes/users.js"


const app = express();
app.disable("x-powered-by");
app.use(express.json());
const connect = connection();


app.use("users", userRouter);

app.get("/", (req, res) => {
    res.status(200).json({message: "Está vivo"})
})


app.listen(config.port, () => {
    console.log(`El servidor está corriendo en el puerto http://localhost:${config.port}`);   
})