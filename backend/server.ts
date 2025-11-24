import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";

import authRoutes from "./routes/auth";
import ayahRoutes from "./routes/ayah";
import hadithRoutes from "./routes/hadith";
import duaRoutes from "./routes/dua";
import prayerRoutes from "./routes/prayer";
import tasbihRoutes from "./routes/tasbih";
import dateRoutes from "./routes/date";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/ayah", ayahRoutes);
app.use("/hadith", hadithRoutes);
app.use("/dua", duaRoutes);
app.use("/prayer", prayerRoutes);
app.use("/tasbih", tasbihRoutes);
app.use("/date", dateRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
