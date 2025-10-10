import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
  name: String,
  description: String,
  icon: String,
});

export default mongoose.model("Badge", badgeSchema);
