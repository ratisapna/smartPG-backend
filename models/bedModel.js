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

    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("Bed", bedSchema);