import { Router } from "express";
import { getTeam, getTeams, deleteTeam, updateTeam, registerTeam } from "../controllers/teams.js"



function teamsRouters(teamModel) {
    const router = Router();
    router.get("/", getTeams(teamModel));
    
    router.get("/:id", getTeam(teamModel));
    
    router.post("/", registerTeam(teamModel));
    
    router.delete("/:id", deleteTeam(teamModel))
    
    router.patch("/:id", updateTeam(teamModel))
    return router;
}


export default teamsRouters;