import mongoose from "mongoose";

const feesSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true
    },

    pgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PG",
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    month: {
      type: String,
      required: true
    },

    dueDate: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["PENDING", "PARTIAL", "PAID", "OVERDUE"],
      default: "PENDING"
    },

    amountPaid: {
      type: Number,
      default: 0
    },

    remainingAmount: {
      type: Number
    }
  },
  { timestamps: true }
);

feesSchema.index({ tenantId: 1, month: 1 }, { unique: true });

export default mongoose.model("Fees", feesSchema);