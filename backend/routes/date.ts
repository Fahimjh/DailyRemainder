import { Router } from "express";
import axios from "axios";

const router = Router();

router.get("/today", async (req, res) => {
  const data = await axios.get("https://api.aladhan.com/v1/gToH");
  res.json(data.data);
});

export default router;
