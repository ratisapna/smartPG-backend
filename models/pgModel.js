import mongoose from "mongoose";

const pgSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    description: {
      type: String,
      trim: true
    },

    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    },

    contactNumber: {
      type: String,
      required: true
    },

    amenities: [
      {
        type: String
      }
    ],

    images: [
      {
        key: {
          type: String
        },
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("PG", pgSchema);