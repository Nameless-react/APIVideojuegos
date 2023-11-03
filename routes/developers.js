import { Router } from "express";
import { getDeveloper, getDevelopers, registerDeveloper, deleteDeveloper, updateDeveloper } from "../controllers/developers.js"



function developersRouters(developer) {
    const router = Router();
    router.get("/", getDevelopers(developer));
    
    router.get("/:id", getDeveloper(developer));
    
    router.post("/", registerDeveloper(developer));
    
    router.delete("/:id", deleteDeveloper(developer))
    
    router.patch("/:id", updateDeveloper(developer))
    return router;
}



export default developersRouters;