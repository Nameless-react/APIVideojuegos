import { Router } from "express";
import { getUser, getUsers, registerUser, deleteUser, updateUser } from "../controllers/users.js"

const router = Router();


router.get("/", getUser);

router.get("/:id", getUsers);

router.post("/register", registerUser);

router.delete("/delete/:id", deleteUser)

router.put("/update/:id", updateUser)


export default router;