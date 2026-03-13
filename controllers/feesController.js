import Fees from "../models/feesModel.js";
import Tenant from "../models/tenantModel.js";


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

    const fees = await Fees.find()
      .populate("tenantId")
      .populate("pgId");

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