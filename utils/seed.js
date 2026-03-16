// utils/seed.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import PG from "../models/pgModel.js";
import Room from "../models/roomModel.js";
import Bed from "../models/bedModel.js";
import Tenant from "../models/tenantModel.js";
import Activity from "../models/activityModel.js";
import Complaint from "../models/complaintModel.js";
import Document from "../models/documentModel.js";
import Fees from "../models/feesModel.js";
import Payment from "../models/paymentModel.js";
import VisitRequest from "../models/visitrequestModel.js";
import ExitRequest from "../models/exitrequestModel.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seed = async () => {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected. Cleaning collections...");

    // Clear all collections
    const collections = [
      User, PG, Room, Bed, Tenant, Activity, Complaint, 
      Document, Fees, Payment, VisitRequest, ExitRequest
    ];
    for (const model of collections) {
      await model.deleteMany({});
    }

    console.log("Seeding dummy data...");

    const hashedPassword = await bcrypt.hash("password123", 10);

    // 1. Create Owner
    const owner = await User.create({
      name: "John Owner",
      email: "owner@test.com",
      phone: "9876543210",
      password: hashedPassword,
      role: "OWNER",
      isVerified: true
    });

    // 2. Create Tenant
    const tenantUser = await User.create({
      name: "Jane Tenant",
      email: "tenant@test.com",
      phone: "9123456780",
      password: hashedPassword,
      role: "TENANT",
      isVerified: true
    });

    // 3. Create PG
    const pg = await PG.create({
      name: "Elite Men's PG",
      ownerId: owner._id,
      description: "Premium PG with all amenities",
      address: {
        street: "BTM Layout",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560076"
      },
      contactNumber: "9876543210",
      amenities: ["WiFi", "Food", "Cleaning", "Parking"],
      rules: ["No smoking", "Entry before 11 PM"],
      images: [
        { key: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=60" }
      ]
    });

    // 4. Create Room
    const room = await Room.create({
      pgId: pg._id,
      roomNumber: "101",
      floor: 1,
      totalBeds: 2,
      rentPerBed: 8000,
      securityDeposit: 8000,
      description: "Spacious double sharing room",
      status: "AVAILABLE",
      images: [
        { key: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=60" }
      ]
    });

    // 5. Create Beds
    const bed1 = await Bed.create({ roomId: room._id, bedNumber: 1, status: "OCCUPIED" });
    const bed2 = await Bed.create({ roomId: room._id, bedNumber: 2, status: "VACANT" });

    // 6. Create Tenant Record
    const tenantRecord = await Tenant.create({
      userId: tenantUser._id,
      pgId: pg._id,
      bedId: bed1._id,
      checkInDate: new Date(),
      depositAmount: 8000,
      status: "ACTIVE"
    });

    // 7. Create Sample activity
    await Activity.create({
      type: "TENANT_CREATED",
      message: "Jane Tenant joined Elite Men's PG",
      userId: owner._id,
      referenceId: tenantRecord._id
    });

    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seed();
