import mongoose from "mongoose";

const visitRequestSchema = new mongoose.Schema(
  {
    pgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PG",
      required: true
    },

    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room"
    },

    visitorName: {
      type: String,
      required: true,
      trim: true
    },

    visitorPhone: {
      type: String,
      required: true
    },

    preferredDate: {
      type: Date
    },

    message: {
      type: String,
      trim: true
    },

    status: {
      type: String,
      enum: ["PENDING", "CONTACTED", "CLOSED"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

export default mongoose.model("VisitRequest", visitRequestSchema);