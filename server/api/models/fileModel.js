import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
  contentType: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

export const File = mongoose.model("File", fileSchema);