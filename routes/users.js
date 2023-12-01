import { Router } from "express";
import { getUser, getUsers, registerUser, deleteUser, updateUser, generateApiKey, addRole, deleteRole } from "../controllers/users.js"


function userRouters(userModel, roleModel) {
    const router = Router();
    router.get("/", getUsers(userModel));

    router.get("/:id", getUser(userModel));

    router.post("/", registerUser(userModel));

    router.delete("/:id", deleteUser(userModel))

    router.patch("/:id", updateUser(userModel));

    router.get("/generateKey/:id", generateApiKey(userModel));

    router.patch("/addRole/:id", addRole(userModel, roleModel));

    router.patch("/deleteRole/:id", deleteRole(userModel));
    return router;
}


export default userRouters;