import { Router } from "express";
import { getDeveloper, getDevelopers, registerDeveloper, deleteDeveloper, updateDeveloper } from "../controllers/developers.js"

const router = Router();


router.get("/", getDevelopers);

router.get("/:id", getDeveloper);

router.post("/", registerDeveloper);

router.delete("/:id", deleteDeveloper)

router.patch("/:id", updateDeveloper)


export default router;