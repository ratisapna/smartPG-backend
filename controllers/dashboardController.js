import Document from "../models/documentModel.js";
import Room from "../models/roomModel.js";
import Bed from "../models/bedModel.js";
import Tenant from "../models/tenantModel.js";
import Fees from "../models/feesModel.js";
import Complaint from "../models/complaintModel.js";
import Activity from "../models/activityModel.js";
import VisitRequest from "../models/visitrequestModel.js";

import PG from "../models/pgModel.js";

/* OWNER DASHBOARD */

export const ownerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const pg = await PG.findOne({ ownerId });

    if (!pg) {
      return res.json({
        success: true,
        data: {
          noPg: true,
          message: "No PG listed yet"
        }
      });
    }

    const pgId = pg._id;

    const totalRooms = await Room.countDocuments({ pgId });
    const totalBeds = await Bed.countDocuments({ roomId: { $in: await Room.find({ pgId }).distinct("_id") } });
    const occupiedBeds = await Bed.countDocuments({ 
      roomId: { $in: await Room.find({ pgId }).distinct("_id") },
      status: "OCCUPIED" 
    });
    const vacantBeds = await Bed.countDocuments({ 
      roomId: { $in: await Room.find({ pgId }).distinct("_id") },
      status: "VACANT" 
    });
    const totalTenants = await Tenant.countDocuments({ pgId, status: "ACTIVE" });

    const activeComplaints = await Complaint.countDocuments({
      pgId,
      status: { $ne: "RESOLVED" }
    });

    const pendingRent = await Fees.aggregate([
      { $match: { pgId, status: "PENDING" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const collectedRent = await Fees.aggregate([
      { $match: { pgId, status: "PAID" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const recentActivities = await Activity.find({ pgId })
      .sort({ createdAt: -1 })
      .limit(5);

    const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

    const pendingDocs = await Document.countDocuments({ 
        tenantId: { $in: await Tenant.find({ pgId }).distinct("_id") },
        verificationStatus: "PENDING" 
    });
    
    // Visit requests should also be linked to PG, check model later if needed
    const pendingVisits = await VisitRequest.countDocuments({ pgId, status: "PENDING" });

    res.json({
      success: true,
      data: {
        pgName: pg.name,
        totalRooms,
        totalBeds,
        occupiedBeds,
        vacantBeds,
        totalTenants,
        activeComplaints,
        occupancyRate,
        pendingRent: pendingRent[0]?.total || 0,
        totalRevenue: collectedRent[0]?.total || 0,
        recentActivities,
        pendingDocs,
        pendingVisits
      }
    });

  } catch (error) {
    console.error("OWNER_DASHBOARD_ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



/* TENANT DASHBOARD */

export const tenantDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    const tenant = await Tenant.findOne({ userId })
      .populate("userId")
      .populate({
        path: "bedId",
        populate: { path: "roomId" }
      });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found"
      });
    }

    const tenantId = tenant._id;
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const currentYear = new Date().getFullYear();

    // Check if fee for current month exists
    let currentMonthFee = await Fees.findOne({ tenantId, month: currentMonth });

    if (!currentMonthFee && tenant.status === "ACTIVE") {
      currentMonthFee = await Fees.create({
        tenantId,
        pgId: tenant.pgId,
        amount: tenant.bedId?.roomId?.rentPerBed || 0,
        month: currentMonth,
        year: currentYear,
        dueDate: new Date(currentYear, new Date().getMonth(), 5), // 5th of current month
        status: "PENDING"
      });
    }

    const pendingFees = await Fees.find({
      tenantId,
      status: { $in: ["PENDING", "PARTIAL"] }
    });

    const totalDue = pendingFees.reduce((sum, fee) => sum + (fee.amount - (fee.amountPaid || 0)), 0);

    const paymentHistory = await Fees.find({
      tenantId,
      status: "PAID"
    }).sort({ updatedAt: -1 }).limit(5);

    const openComplaints = await Complaint.countDocuments({
      tenantId,
      status: { $ne: "RESOLVED" }
    });

    const documents = await Document.find({ tenantId });

    const pg = await PG.findById(tenant.pgId);

    res.json({
      success: true,
      data: {
        tenantName: tenant.userId?.name || "",
        pgName: pg?.name || "My PG",
        status: tenant.status,
        dueAmount: totalDue,
        openComplaints,
        lastPaymentDate: paymentHistory.length > 0 ? paymentHistory[0].updatedAt : null,
        documents: documents.map(doc => ({
          type: doc.type,
          status: doc.verificationStatus
        })),
        paymentHistory: paymentHistory.map(fee => ({
          month: fee.month,
          amount: fee.amountPaid,
          date: fee.updatedAt,
          status: "SUCCESS"
        })),
        roomInfo: {
          roomNumber: tenant.bedId?.roomId?.roomNumber,
          bedNumber: tenant.bedId?.bedNumber,
          rent: tenant.bedId?.roomId?.rentPerBed
        }
      }
    });

  } catch (error) {
    console.error("TENANT_DASHBOARD_ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};