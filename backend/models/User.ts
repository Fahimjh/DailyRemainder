import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  bookmarks: [{
    type: { type: String }, // e.g., 'ayah' | 'hadith' | 'dua'
    data: mongoose.Schema.Types.Mixed, // store relevant item (ayah object, hadith string, etc.)
    createdAt: { type: Date, default: Date.now }
  }]
});

export default mongoose.model("User", UserSchema);
