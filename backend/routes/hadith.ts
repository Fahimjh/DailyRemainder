import { Router } from "express";

const router = Router();

const hadiths = [
  "Actions are judged by intentions.",
  "Make things easy and do not make them difficult.",
  "The best among you are those who have the best manners."
];

router.get("/random", (req, res) => {
  const h = hadiths[Math.floor(Math.random() * hadiths.length)];
  res.json({ hadith: h });
});

export default router;
