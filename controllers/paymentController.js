import Payment from "../models/paymentModel.js";
import Fees from "../models/feesModel.js";


import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

import Tenant from "../models/tenantModel.js";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Step 1: Create an order for Razorpay Checkout
 */
export const createRazorpayOrder = async (req, res) => {
  try {
    const { feesId } = req.body;

    if (!feesId) {
      return res.status(400).json({ success: false, message: "feesId is required" });
    }

    const fees = await Fees.findById(feesId);

    if (!fees) {
      return res.status(404).json({ success: false, message: "Fees record not found" });
    }

    if (!fees.amount || fees.amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid fee amount for payment" });
    }

    const options = {
      amount: Math.round(fees.amount * 100), // Razorpay works in paise
      currency: "INR",
      receipt: `rcpt_${feesId.slice(-12)}_${Date.now().toString().slice(-8)}`,
    };

    console.log("[PAYMENT DEBUG] Creating Razorpay order with options:", options);
    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("RAZORPAY_ORDER_ERROR:", error.message);
    console.error("RAZORPAY_ORDER_STACK:", error.stack);
    if (error.error) console.error("RAZORPAY_API_ERROR:", JSON.stringify(error.error));
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Step 2: Verify the payment signature and record in DB
 */
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      feesId
    } = req.body;

    const userId = req.user.userId;
    const tenant = await Tenant.findOne({ userId });
    if (!tenant) return res.status(404).json({ success: false, message: "Tenant record not found" });

    const tenantId = tenant._id;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const fees = await Fees.findById(feesId);

    // Record the payment
    const payment = await Payment.create({
      tenantId,
      feesId,
      amount: fees.amount,
      paymentMethod: "ONLINE",
      transactionId: razorpay_payment_id,
      status: "SUCCESS"
    });

    // Update fees status
    await Fees.findByIdAndUpdate(feesId, { 
      status: "PAID",
      amountPaid: fees.amount,
      remainingAmount: 0
    });

    res.json({
      success: true,
      message: "Payment verified and recorded",
      payment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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