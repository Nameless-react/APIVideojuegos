import { Router } from "express";
import { getTeam, getTeams, deleteTeam, updateTeam, registerTeam } from "../controllers/teams.js"



function teamsRouters(team) {
    const router = Router();
    router.get("/", getTeams(team));
    
    router.get("/:id", getTeam(team));
    
    router.post("/", registerTeam(team));
    
    router.delete("/:id", deleteTeam(team))
    
    router.patch("/:id", updateTeam(team))
    return router;
}


export default teamsRouters;