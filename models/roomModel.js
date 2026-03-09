import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    pgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PG",
      required: true
    },

    roomNumber: {
      type: String,
      required: true,
      trim: true
    },

    floor: {
      type: Number
    },

    totalBeds: {
      type: Number,
      required: true,
      min: 1
    },

    rentPerBed: {
      type: Number,
      required: true
    },

    securityDeposit: {
      type: Number,
      default: 0
    },

    description: {
      type: String,
      trim: true
    },

    images: [
      {
        key: String,
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    status: {
      type: String,
      enum: ["AVAILABLE", "FULL", "MAINTENANCE"],
      default: "AVAILABLE"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);