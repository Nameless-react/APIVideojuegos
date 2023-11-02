import config from "./config/config.js";
import cors from "cors";
import express from "express";
import connection from "./db/connection.js";
import errorHandler from "./middlewares/errorHandler.js";

// Routers
import userRouter from "./routes/users.js";
import developerRouter from "./routes/developers.js";
import videogameRouter from "./routes/videogame.js";

const app = express();
app.disable("x-powered-by");
app.use(express.json());
//* Can add the allowed domains to avoid the "*" in the headers of CORS
app.use(cors());
const connect = connection();


app.use("/videogames", videogameRouter);
app.use("/users", userRouter);
app.use("/developers", developerRouter);

app.get("/", (req, res) => {
    res.status(200).json({message: "Está vivo"})
})

app.use(errorHandler);


app.listen(config.port, () => {
    console.log(`El servidor está corriendo en el puerto http://localhost:${config.port}`);   
})