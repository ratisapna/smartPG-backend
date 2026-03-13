import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({

  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  },

  type: {
    type: String,
    enum: [
      "AADHAAR",
      "COLLEGE_ID",
      "EMPLOYEE_ID",
      "PASSPORT",
      "OTHER"
    ],
    required: true
  },

  s3Key: {
    type: String,
    required: true
  },

  verificationStatus: {
    type: String,
    enum: ["PENDING", "VERIFIED", "REJECTED"],
    default: "PENDING"
  }

}, { timestamps: true });

export default mongoose.model("Document", documentSchema);