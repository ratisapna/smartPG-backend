import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    imageKey: {
      type: String
    },

    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED"],
      default: "OPEN"
    },

    resolvedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);