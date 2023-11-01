import { Router } from "express";
import { getVideogame, getVideogames, deleteVideogame, updateVideogame, registerVideogame } from "./../controllers/videogame.js"

const router = Router();


router.get("/", getVideogames);

router.get("/:id", getVideogame);

router.post("/", registerVideogame);

router.delete("/:id", deleteVideogame)

router.patch("/:id", updateVideogame)


export default router;