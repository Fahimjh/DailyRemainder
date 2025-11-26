import { Router } from "express";
import { register, login, updateBookmarks, getMe } from "../controllers/authController";

const router = Router();


router.post("/register", register);
router.post("/login", login);
router.post("/updateBookmarks", updateBookmarks);

import { verifyToken } from "../middleware/verifyToken";
router.get("/me", verifyToken, getMe);

export default router;
