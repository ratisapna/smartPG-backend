import Fees from "../models/feesModel.js";
import Tenant from "../models/tenantModel.js";
import PG from "../models/pgModel.js";
import Activity from "../models/activityModel.js";


/* GENERATE MONTHLY RENT */

export const generateFees = async (req, res) => {

  try {

    const { month, year, amount } = req.body;

    const tenants = await Tenant.find({ status: "ACTIVE" });

    const dueDate = new Date(year, new Date(`${month} 1, ${year}`).getMonth(), 5);

    const feesRecords = tenants.map((tenant) => ({
      tenantId: tenant._id,
      pgId: tenant.pgId,
      month,
      year,
      amount,
      dueDate
    }));

    await Fees.insertMany(feesRecords);

    res.json({
      success: true,
      message: "Monthly fees generated"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


/* GET ALL FEES */

export const getFees = async (req, res) => {

  try {

    const ownerId = req.user.userId;
    const pg = await PG.findOne({ ownerId });
    if (!pg) return res.json({ success: true, fees: [] });

    const fees = await Fees.find({ pgId: pg._id })
      .populate("tenantId")
      .populate("pgId");

    res.json({
      success: true,
      fees
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }

};

export const getMyFees = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ userId: req.user.userId });
    if (!tenant) return res.status(404).json({ success: false, message: "Tenant record not found" });

    const fees = await Fees.find({ tenantId: tenant._id }).populate("pgId");
    res.json({ success: true, fees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



/* GET TENANT FEES */

export const getTenantFees = async (req, res) => {

  try {

    const { tenantId } = req.params;

    const fees = await Fees.find({ tenantId });

    res.json({
      success: true,
      fees
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const markFeeAsPaid = async (req, res) => {
  try {
    const { tenantId, amount, month } = req.body;
    const ownerId = req.user.userId;

    // Verify owner owns the PG the tenant is in
    const tenant = await Tenant.findById(tenantId).populate("userId");
    if (!tenant) return res.status(404).json({ success: false, message: "Tenant not found" });

    // Check if a record already exists for this tenant and month
    let fee = await Fees.findOne({ tenantId, month });

    if (fee) {
      fee.status = "PAID";
      fee.amountPaid = amount || fee.amount;
      fee.remainingAmount = 0;
      await fee.save();
    } else {
      fee = await Fees.create({
        tenantId,
        pgId: tenant.pgId,
        amount: amount || 0,
        amountPaid: amount || 0,
        month,
        dueDate: new Date(),
        status: "PAID",
        remainingAmount: 0
      });
    }

    await Activity.create({
      userId: ownerId,
      pgId: tenant.pgId,
      type: "RENT_PAID",
      message: `Rent for ${month} marked as paid for ${tenant.userId?.name || 'Resident'}`
    });

    res.json({
      success: true,
      message: `Rent for ${month} marked as paid`,
      fee
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};