import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true
    },

    feesId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fees",
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 1
    },

    paymentMethod: {
      type: String,
      enum: ["ONLINE", "UPI", "CASH"],
      default: "ONLINE"
    },

    transactionId: {
      type: String
    },

    paymentDate: {
      type: Date,
      default: Date.now
    },

    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "REFUNDED"],
      default: "SUCCESS"
    },

    note: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

// indexes for faster queries
paymentSchema.index({ tenantId: 1 });
paymentSchema.index({ feesId: 1 });

export default mongoose.model("Payment", paymentSchema);