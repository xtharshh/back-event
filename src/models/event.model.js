import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Technical", "Cultural", "Sports", "Workshop", "Seminar"],
      required: true,
    },
    coordinatorName: {
      type: String,
      required: true,
      trim: true,
    },
    coordinatorContact: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },

    coordinatorEmail: {
      type: String,
      required: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },

    club: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    facultyName: {
      type: String,
      required: true,
      trim: true,
    },

    facultyEmail: {
      type: String,
      required: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },

    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    eventImage: {
      type: String, // Assuming URL or file path to image
    },
  },

  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);