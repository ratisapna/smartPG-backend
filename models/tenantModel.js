import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    pgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PG",
      required: true
    },

    bedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bed",
      required: true
    },

    checkInDate: {
      type: Date,
      required: true
    },

    contractEndDate: {
      type: Date
    },

    depositAmount: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["ACTIVE", "NOTICE", "EXITED", "DEFAULTER"],
      default: "ACTIVE"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Tenant", tenantSchema);