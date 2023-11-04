import { Router } from "express";
import { getRole, getRoles, registerRole, deleteRole, updateRole } from "../controllers/roles.js"



function rolesRouters(roleModel) {
    const router = Router();
    router.get("/", getRoles(roleModel));
    
    router.get("/:id", getRole(roleModel));
    
    router.post("/", registerRole(roleModel));
    
    router.delete("/:id", deleteRole(roleModel))
    
    router.patch("/:id", updateRole(roleModel))
    return router;
}



export default rolesRouters;