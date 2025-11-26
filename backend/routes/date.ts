import { Router } from "express";
import axios from "axios";

const router = Router();
// Get the full calendar for a month (Gregorian and Hijri)
router.get("/month", async (req, res) => {
  try {
    let { month, year } = req.query;
    if (!month || !year) {
      const today = new Date();
      year = String(today.getFullYear());
      month = String(today.getMonth() + 1).padStart(2, '0');
    }
    // Fetch from Aladhan API
    const { data } = await axios.get(`https://api.aladhan.com/v1/gToHCalendar/${month}/${year}`);
    res.json({ days: data.data });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch Hijri month calendar" });
  }
});

router.get("/today", async (req, res) => {
  try {
    // Get today's date in YYYY-MM-DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${dd}-${mm}-${yyyy}`;
    // Fetch from Aladhan API
    const { data } = await axios.get(`https://api.aladhan.com/v1/gToH?date=${dateStr}`);
    // Return only the date object (with gregorian and hijri)
    res.json({
      date: data.data
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch Hijri date" });
  }
});

export default router;
