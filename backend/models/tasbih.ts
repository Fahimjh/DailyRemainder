import mongoose from "mongoose";

const TasbihSchema = new mongoose.Schema({
  userId: String,
  count: Number
});

export default mongoose.model("Tasbih", TasbihSchema);
