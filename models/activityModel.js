import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({

  type: {
    type: String,
    enum: [
      "TENANT_CREATED",
      "PAYMENT_RECEIVED",
      "COMPLAINT_CREATED",
      "DOCUMENT_UPLOADED",
      "VISIT_REQUEST",
      "EXIT_REQUEST"
    ]
  },

  message: {
    type: String
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  referenceId: {
    type: mongoose.Schema.Types.ObjectId
  }

}, { timestamps: true });

export default mongoose.model("Activity", activitySchema);