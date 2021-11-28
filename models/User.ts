import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export const User = (mongoose.models.users || mongoose.model('users', UserSchema));