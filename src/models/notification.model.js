import mongoose, { model, Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USer",
    },
    content: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false, // So it's shown once until marked seen
    },
  },
  { timestamps: true }
);


export const Notification = model("Notification", notificationSchema)