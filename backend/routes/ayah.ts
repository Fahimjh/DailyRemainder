import { Router } from "express";

const router = Router();

const ayahs = [
  {
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Indeed, with hardship comes ease."
  },
  {
    arabic: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ",
    translation: "Allah is the Light of the heavens and the earth."
  }
];

router.get("/random", (req, res) => {
  const random = ayahs[Math.floor(Math.random() * ayahs.length)];
  res.json(random);
});

export default router;
