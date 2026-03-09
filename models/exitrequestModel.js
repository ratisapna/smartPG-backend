import mongoose from "mongoose";

const exitRequestSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true
    },

    reason: {
      type: String,
      trim: true
    },

    requestDate: {
      type: Date,
      default: Date.now
    },

    approved: {
      type: Boolean,
      default: false
    },

    refundAmount: {
      type: Number,
      default: 0
    },

    processedDate: {
      type: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("ExitRequest", exitRequestSchema);