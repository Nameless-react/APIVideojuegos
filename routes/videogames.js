import { Router } from "express";
import { getVideogame, getVideogames, deleteVideogame, updateVideogame, registerVideogame } from "../controllers/videogames.js"


function videogameRouters(videogame) {
    const router = Router();
    router.get("/", getVideogames(videogame));
    
    router.get("/:id", getVideogame(videogame));
    
    router.post("/", registerVideogame(videogame));
    
    router.delete("/:id", deleteVideogame(videogame))
    
    router.patch("/:id", updateVideogame(videogame))
    return router;
}


export default videogameRouters;