import { Router } from "express";
import { getVideogame, getVideogames, deleteVideogame, updateVideogame, registerVideogame } from "../controllers/videogames.js"


function videogameRouters(videogameModel) {
    const router = Router();
    router.get("/", getVideogames(videogameModel));
    
    router.get("/:id", getVideogame(videogameModel));
    
    router.post("/", registerVideogame(videogameModel));
    
    router.delete("/:id", deleteVideogame(videogameModel))
    
    router.patch("/:id", updateVideogame(videogameModel))
    return router;
}


export default videogameRouters;