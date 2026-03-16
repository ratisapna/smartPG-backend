import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({

  type: {
    type: String,
    enum: [
      "TENANT_CREATED",
      "PAYMENT_RECEIVED",
      "COMPLAINT_CREATED",
      "COMPLAINT_UPDATED",
      "DOCUMENT_UPLOADED",
      "VISIT_REQUEST",
      "EXIT_REQUEST",
      "ROOM_CREATED",
      "RENT_PAID"
    ]
  },

  message: {
    type: String
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  pgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PG"
  },

  referenceId: {
    type: mongoose.Schema.Types.ObjectId
  }

}, { timestamps: true });

export default mongoose.model("Activity", activitySchema);