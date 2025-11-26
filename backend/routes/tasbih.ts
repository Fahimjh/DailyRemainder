import { Router } from "express";
import Tasbih from "../models/tasbih";

const router = Router();

router.post("/save", async (req, res) => {
  const { userId, count } = req.body;
  const data = await Tasbih.create({ userId, count });
  res.json(data);
});

// Get tasbih history for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const items = await Tasbih.find({ userId }).sort({ createdAt: -1 }).limit(50);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch" });
  }
});

export default router;
