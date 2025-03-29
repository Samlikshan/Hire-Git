import mongoose from "mongoose";

const adminSchem = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
  },
  { timestamps: true }
);

export const AdminModel = mongoose.model("Admins", adminSchem);
