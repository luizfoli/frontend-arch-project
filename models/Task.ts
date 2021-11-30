import mongoose, { Schema } from "mongoose";

export const Task =
  mongoose.models.tasks ||
  mongoose.model(
    "tasks",
    new Schema({
      userId: { type: String, required: true},
      name: { type: String, required: true },
      previsionDate: { type: Date, required: true },
      finishDate: { type: Date, required: false }
    })
  );
