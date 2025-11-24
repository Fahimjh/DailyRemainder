import { Router } from "express";

const router = Router();

const duas = [
  { arabic: "رَبِّ زِدْنِي عِلْمًا", translation: "My Lord, increase me in knowledge." },
  { arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً", translation: "Our Lord, give us good in this world." }
];

router.get("/", (req, res) => {
  res.json(duas);
});

export default router;
