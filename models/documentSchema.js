import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true
    },

    type: {
      type: String,
      enum: ["AADHAAR", "COLLEGE_ID", "AGREEMENT"],
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
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);