import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  title: String,
  issueDate: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Certificate", certificateSchema);
