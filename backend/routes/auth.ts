import { Router } from "express";
import { register, login, updateBookmarks } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/updateBookmarks", updateBookmarks);

export default router;
