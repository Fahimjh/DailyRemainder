import { Router } from "express";
import axios from "axios";

const router = Router();

router.get("/:city/:country", async (req, res) => {
  const { city, country } = req.params;

  const response = await axios.get(
    `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`
  );

  res.json(response.data);
});

export default router;
