import Payment from "../models/paymentModel.js";
import Fees from "../models/feesModel.js";


export const createPayment = async (req, res) => {

  try {

    const {
      tenantId,
      feesId,
      amount,
      paymentMethod,
      transactionId
    } = req.body;

    const payment = await Payment.create({
      tenantId,
      feesId,
      amount,
      paymentMethod,
      transactionId
    });

    await Fees.findByIdAndUpdate(feesId, {
      status: "PAID"
    });

    res.json({
      success: true,
      message: "Payment recorded",
      payment
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



export const getPayments = async (req, res) => {

  try {

    const payments = await Payment.find()
      .populate("tenantId")
      .populate("feesId");

    res.json({
      success: true,
      payments
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};