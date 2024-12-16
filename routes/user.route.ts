import {
    changeUserPassword,
    deleteUser,
    login,
    logout,
    register,
} from "../controllers/user.controller";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", authMiddleware, logout);
router.delete("/delete", authMiddleware, deleteUser);
router.post("/change", authMiddleware, changeUserPassword);

export default router;
