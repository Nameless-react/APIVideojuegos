import { Router } from "express";
import { getDeveloper, getDevelopers, registerDeveloper, deleteDeveloper, updateDeveloper } from "../controllers/developers.js"



function developersRouters(developerModel) {
    const router = Router();
    router.get("/", getDevelopers(developerModel));
    
    router.get("/:id", getDeveloper(developerModel));
    
    router.post("/", registerDeveloper(developerModel));
    
    router.delete("/:id", deleteDeveloper(developerModel))
    
    router.patch("/:id", updateDeveloper(developerModel))
    return router;
}



export default developersRouters;