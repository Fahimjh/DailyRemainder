import bookmarkRoutes from "./routes/bookmark";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";

import authRoutes from "./routes/auth";
import authExtras from "./routes/authExtras";
import ayahRoutes from "./routes/ayah";
import quranRoutes from "./routes/quran";
import prayerRoutes from "./routes/prayer";
import tasbihRoutes from "./routes/tasbih";
import dateRoutes from "./routes/date";

dotenv.config();
connectDB();


const app = express();
app.use(cors());
app.use(express.json());
app.use("/bookmark", bookmarkRoutes);

app.use("/auth", authRoutes);
app.use("/auth", authExtras); // after authRoutes
app.use("/ayah", ayahRoutes);
app.use("/quran", quranRoutes);
app.use("/prayer", prayerRoutes);
app.use("/tasbih", tasbihRoutes);
app.use("/date", dateRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
