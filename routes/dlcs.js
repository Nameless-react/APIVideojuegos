import { Router } from "express";
import { getDlc, getDlcs, registerDlc, deleteDlc, updateDlc } from "../controllers/dlcs.js"



function dlcsRouters(dlcModel) {
    const router = Router();
    router.get("/", getDlcs(dlcModel));
    
    router.get("/:id", getDlc(dlcModel));
    
    router.post("/", registerDlc(dlcModel));
    
    router.delete("/:id", deleteDlc(dlcModel))
    
    router.patch("/:id", updateDlc(dlcModel))
    return router;
}



export default dlcsRouters;