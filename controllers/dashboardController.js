import Room from "../models/roomModel.js";
import Bed from "../models/bedModel.js";
import Tenant from "../models/tenantModel.js";
import Fees from "../models/feesModel.js";


/* OWNER DASHBOARD */

export const ownerDashboard = async (req, res) => {

  try {

    const totalRooms = await Room.countDocuments();

    const totalBeds = await Bed.countDocuments();

    const occupiedBeds = await Bed.countDocuments({
      status: "OCCUPIED"
    });

    const vacantBeds = await Bed.countDocuments({
      status: "VACANT"
    });

    const totalTenants = await Tenant.countDocuments({
      status: "ACTIVE"
    });

    const pendingRent = await Fees.aggregate([
      { $match: { status: "PENDING" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const collectedRent = await Fees.aggregate([
      { $match: { status: "PAID" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.json({
      success: true,
      data: {
        totalRooms,
        totalBeds,
        occupiedBeds,
        vacantBeds,
        totalTenants,
        pendingRent: pendingRent[0]?.total || 0,
        collectedRent: collectedRent[0]?.total || 0
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



/* TENANT DASHBOARD */

export const tenantDashboard = async (req, res) => {

  try {

    const { tenantId } = req.params;

    const tenant = await Tenant.findById(tenantId)
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

    const pendingFees = await Fees.find({
      tenantId,
      status: "PENDING"
    });

    const totalDue = pendingFees.reduce(
      (sum, fee) => sum + fee.amount,
      0
    );

    res.json({
      success: true,
      data: {
        tenantName: tenant.userId?.name || "",
        roomNumber: tenant.bedId?.roomId?.roomNumber,
        bedNumber: tenant.bedId?.bedNumber,
        pendingFees: pendingFees,
        totalDue
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};