import { Router } from "express";
import Tasbih from "../models/tasbih";

const router = Router();

router.post("/save", async (req, res) => {
  const { userId, count } = req.body;
  try {
    const data = await Tasbih.findOneAndUpdate(
      { userId },
      { count },
      { new: true, upsert: true }
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to save tasbih count" });
  }
});

export default router;
