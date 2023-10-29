import { Router } from "express";
import { getDeveloper, getDevelopers, registerDeveloper, deleteDeveloper, updateDeveloper } from "../controllers/developers.js"

const router = Router();


router.get("/", getDevelopers);

router.get("/:id", getDeveloper);

router.post("/register", registerDeveloper);

router.delete("/delete/:id", deleteDeveloper)

router.put("/update/:id", updateDeveloper)


export default router;