import { Router } from "express";
import { getUser, getUsers, registerUser, deleteUser, updateUser } from "../controllers/users.js"


function userRouters(userModel) {
    const router = Router();
    router.get("/", getUser(userModel));

    router.get("/:id", getUsers(userModel));

    router.post("/register", registerUser(userModel));

    router.delete("/delete/:id", deleteUser(userModel))

    router.put("/update/:id", updateUser(userModel))
    return router;
}


export default userRouters;