import { Router } from "express";
import { getcomment, getcomments, registercomment, deletecomment, updatecomment } from "../controllers/comments.js"



function commentsRouters(commentsModel) {
    const router = Router();
    router.get("/", getComment(commentsModel));
    
    router.get("/:id", getComment(commentsModel));
    
    router.post("/", registerComment(commentsModel));
    
    router.delete("/:id", deleteComment(commentsModel))
    
    router.patch("/:id", updateComment(commentsModel))
    return router;
}



export default commentsRouters;