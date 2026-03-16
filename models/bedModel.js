import mongoose from "mongoose";

const bedSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },

    bedNumber: {
      type: Number,
      required: true
    },

    isOccupied: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["VACANT", "OCCUPIED"],
      default: "VACANT"
    },

    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      default: null
    },

    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("Bed", bedSchema);