import mongoose from "mongoose";

const exitRequestSchema = new mongoose.Schema({

  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  },

  reason: {
    type: String
  },

  requestedDate: {
    type: Date,
    default: Date.now
  },

  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING"
  }

}, { timestamps: true });

export default mongoose.model("ExitRequest", exitRequestSchema);