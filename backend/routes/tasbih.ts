import { Router } from "express";
import Tasbih from "../models/tasbih";

const router = Router();

router.post("/save", async (req, res) => {
  const { userId, count } = req.body;
  const data = await Tasbih.create({ userId, count });
  res.json(data);
});

export default router;
