import config from "./config/config.js";
import cors from "cors";
import express from "express";
import connection from "./db/connection.js";
import errorHandler from "./middlewares/errorHandler.js";
import { CustomError } from "./utils/customError.js";


// Routers
import userRouter from "./routes/users.js";
import developerRouter from "./routes/developers.js";
import videogameRouter from "./routes/videogames.js";
import teamRouter from "./routes/teams.js";
import dlcRouter from "./routes/dlcs.js";
import roleRouter from "./routes/roles.js";
import commentRouter from "./routes/comments.js"


//Models
import developerModel from "./db/developer.js"
import teamModel from "./db/team.js"
import videogameModel from "./db/videogame.js"
import dlcModel from "./db/dlc.js"
import roleModel from "./db/role.js"
import commentModel from "./db/comment.js"
import userModel from "./db/user.js"




import logger from "./utils/logger.js";
import auth from "./middlewares/auth.js";
import userInfo from "./middlewares/userInfo.js";

process.on('SIGTERM', signal => {
    logger.close();
    process.exit(0);
})

process.on('SIGINT', signal => {
    logger.close();
    process.exit(0);
})

process.on("exit", signal => {
    logger.close();
    process.exit(0);
}
)
process.on("beforeExit", signal => {
    logger.close();
    process.exit(0);
})


const app = express();
app.disable("x-powered-by");
app.use(express.json());
//* Can add the allowed domains to avoid the "*" in the headers of CORS
app.use(cors());
const connect = connection();

app.get("/", (req, res) => {
    res.status(200).json({
        message: "API de videojuegos"
    })
})

app.use(auth(userModel));
app.use(userInfo(userModel));

app.use("/videogames", videogameRouter(videogameModel));
app.use("/users", userRouter(userModel));
app.use("/comments", commentRouter(commentModel));
app.use("/developers", developerRouter(developerModel));
app.use("/teams", teamRouter(teamModel));
app.use("/dlcs", dlcRouter(dlcModel));
app.use("/roles", roleRouter(roleModel));


app.all("*", (req, res, next) => {
    next(new CustomError(JSON.stringify({message: `Can't find ${req.originalUrl} on the server`}), 404, "not found"));
})

app.use(errorHandler);




app.listen(config.port, () => {
    console.log(`El servidor está corriendo en el puerto http://localhost:${config.port}`);   
})