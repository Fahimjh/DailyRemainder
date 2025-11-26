import { Router } from "express";
import User from "../models/User";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

// add bookmark (requires token)
router.post("/add", verifyToken, async (req: any, res) => {
  try {
    const userId = req.userId;
    const { type, data } = req.body;
    const user: any = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.bookmarks.push({ type, data });
    await user.save();
    res.json({ message: "Bookmark added", bookmark: user.bookmarks[user.bookmarks.length - 1] });
  } catch (err) {
    res.status(500).json({ message: "Failed to add bookmark" });
  }
});

// get bookmarks (requires token)
router.get("/", verifyToken, async (req: any, res) => {
  try {
    const userId = req.userId;
    const user: any = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.bookmarks || []);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookmarks" });
  }
});

export default router;
