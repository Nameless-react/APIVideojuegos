import { Router } from "express";
import { getTeam, getTeams, deleteTeam, updateTeam, registerTeam } from "../controllers/teams.js"

const router = Router();


router.get("/", getTeams);

router.get("/:id", getTeam);

router.post("/", registerTeam);

router.delete("/:id", deleteTeam)

router.patch("/:id", updateTeam)


export default router;