import { Router } from "express";
import User from "../models/User";

const router = Router();

router.post("/updateBookmarks", async (req, res) => {
  const { userId, bookmarks } = req.body;
  if (!userId) return res.status(400).json({ message: "No userId" });
  try {
    const user = await User.findByIdAndUpdate(userId, { bookmarks }, { new: true });
    res.json(user);
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
});

export default router;
