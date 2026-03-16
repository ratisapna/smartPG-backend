import Complaint from "../models/complaintModel.js";
import PG from "../models/pgModel.js";
import Activity from "../models/activityModel.js";

export const createComplaint = async (req, res) => {
  try {
    // We should probably get pgId from the tenant record instead of req.body if tenant is logged in
    const complaint = await Complaint.create(req.body);

    res.status(201).json({
      success: true,
      complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getComplaints = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const pg = await PG.findOne({ ownerId });

    if (!pg) {
      return res.json({ success: true, complaints: [] });
    }

    const complaints = await Complaint.find({ pgId: pg._id })
      .populate("tenantId");

    res.json({
      success: true,
      complaints
    });
  } catch (error) {
     res.status(500).json({ success: false, message: error.message });
  }
};


export const updateComplaint = async (req, res) => {

  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  await Activity.create({
    userId: req.user.userId,
    pgId: complaint.pgId,
    type: "COMPLAINT_UPDATED",
    message: `Complaint status updated to ${req.body.status || 'Resolved'}`
  });

  res.json({
    success: true,
    complaint
  });

};