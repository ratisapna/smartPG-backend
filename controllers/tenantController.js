import Tenant from "../models/tenantModel.js";
import Bed from "../models/bedModel.js";
import User from "../models/userModel.js";
import Activity from "../models/activityModel.js";
import PG from "../models/pgModel.js";
import Fees from "../models/feesModel.js";
import bcrypt from "bcrypt";



/* CREATE TENANT */

export const createTenant = async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      bedId,
      checkInDate,
      depositAmount
    } = req.body;

    const ownerId = req.user.userId;
    const pg = await PG.findOne({ ownerId });

    if (!pg) {
      return res.status(404).json({ success: false, message: "No PG found for this owner" });
    }

    const pgId = pg._id;

    /* check if user already exists or create new one */
    let user = await User.findOne({ email });

    if (user && user.role !== "TENANT") {
      return res.status(400).json({
        success: false,
        message: "User exists but is not a tenant"
      });
    }

    if (!user) {
      /* create temporary password */
      const tempPassword = "tenant123";
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role: "TENANT",
        isVerified: true
      });
    }

    const bed = await Bed.findById(bedId);

    if (!bed) {
      return res.status(404).json({
        success: false,
        message: "Bed not found"
      });
    }

    if (bed.status === "OCCUPIED") {
      return res.status(400).json({
        success: false,
        message: "Bed already occupied"
      });
    }



    /* create tenant profile */

    const tenant = await Tenant.create({
      userId: user._id,
      bedId,
      pgId,
      checkInDate,
      depositAmount,
      status: "ACTIVE"
    });

    /* update bed status */

    await Bed.findByIdAndUpdate(bedId, {
      status: "OCCUPIED",
      tenantId: tenant._id,
      residentId: user._id,
      isOccupied: true
    });

    /* log activity */

    await Activity.create({
      type: "TENANT_CREATED",
      message: `New resident ${name} added to Room ${bed.roomId?.roomNumber || 'N/A'}`,
      userId: ownerId,
      pgId: pgId,
      referenceId: tenant._id
    });

    res.status(201).json({
      success: true,
      message: "Tenant created successfully",
      tenant
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



/* GET ALL TENANTS */

export const getTenants = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const pg = await PG.findOne({ ownerId });

    if (!pg) {
      return res.json({ success: true, tenants: [] });
    }

    const tenants = await Tenant.find({ pgId: pg._id })
      .populate("userId", "name email phone")
      .populate({
        path: "bedId",
        populate: { path: "roomId", select: "roomNumber floor rentPerBed" }
      });

    // Auto-generate current month fees if missing
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const currentYear = new Date().getFullYear();

    await Promise.all(tenants.map(async (tenant) => {
      if (tenant.status === "ACTIVE") {
        const feeExists = await Fees.findOne({ tenantId: tenant._id, month: currentMonth });
        if (!feeExists) {
          console.log(`[DEBUG] Creating fee for tenant ${tenant._id}, PG: ${tenant.pgId}, Amount: ${tenant.bedId?.roomId?.rentPerBed}`);
          try {
            await Fees.create({
              tenantId: tenant._id,
              pgId: tenant.pgId,
              amount: tenant.bedId?.roomId?.rentPerBed || 0,
              month: currentMonth,
              year: currentYear,
              dueDate: new Date(currentYear, new Date().getMonth(), 5),
              status: "PENDING"
            });
          } catch (createError) {
            console.error(`[ERROR] Fees.create failed for tenant ${tenant._id}:`, createError.message);
            // Don't throw, just log so other tenants can load?
            // Actually, if one fails, the whole req might fail if we don't catch.
          }
        }
      }
    }));

    res.json({
      success: true,
      tenants
    });

  } catch (error) {
    console.error("GET_TENANTS_ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyTenantRecord = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ userId: req.user.userId })
      .populate("pgId")
      .populate("bedId");

    if (!tenant) {
      return res.status(404).json({ success: false, message: "No tenant record found for this user" });
    }

    res.json({
      success: true,
      tenant
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



/* GET TENANT BY ID */

export const getTenantById = async (req, res) => {

  try {

    const { tenantId } = req.params;

    const tenant = await Tenant.findById(tenantId)
      .populate("userId")
      .populate("bedId")
      .populate("pgId");

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found"
      });
    }

    res.json({
      success: true,
      tenant
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



/* UPDATE TENANT */

export const updateTenant = async (req, res) => {

  try {

    const { tenantId } = req.params;

    const tenant = await Tenant.findByIdAndUpdate(
      tenantId,
      req.body,
      { new: true }
    );

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found"
      });
    }

    res.json({
      success: true,
      message: "Tenant updated successfully",
      tenant
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



/* DELETE TENANT */

export const deleteTenant = async (req, res) => {

  try {

    const { tenantId } = req.params;

    const tenant = await Tenant.findById(tenantId);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found"
      });
    }

    /* free bed */

    await Bed.findByIdAndUpdate(tenant.bedId, {
      status: "VACANT"
    });

    await Tenant.findByIdAndDelete(tenantId);

    /* log activity */

    await Activity.create({
      type: "TENANT_REMOVED",
      message: "Tenant removed",
      referenceId: tenantId
    });

    res.json({
      success: true,
      message: "Tenant removed successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};