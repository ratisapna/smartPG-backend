// models/userModel.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },

    role: {
      type: String,
      enum: ["OWNER", "TENANT"],
      required: true
    },

    profileImage: {
      key: String
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    lastLogin: Date
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", userSchema);