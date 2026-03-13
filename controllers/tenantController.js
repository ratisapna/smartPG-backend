import Tenant from "../models/tenantModel.js";
import Bed from "../models/bedModel.js";
import User from "../models/userModel.js";
import Activity from "../models/activityModel.js";
import bcrypt from "bcrypt";



/* CREATE TENANT */

export const createTenant = async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      bedId,
      pgId,
      checkInDate,
      depositAmount
    } = req.body;

    /* check if user already exists */

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    /* check bed */

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

    /* create temporary password */

    const tempPassword = "tenant123";

    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    /* create user */

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "TENANT",
      isVerified: true
    });

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
      status: "OCCUPIED"
    });

    /* log activity */

    await Activity.create({
      type: "TENANT_CREATED",
      message: `Tenant ${name} added`,
      userId: user._id,
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

    const tenants = await Tenant.find()
      .populate("userId")
      .populate("bedId")
      .populate("pgId");

    res.json({
      success: true,
      tenants
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

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