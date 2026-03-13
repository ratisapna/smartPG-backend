import Complaint from "../models/complaintModel.js";

export const createComplaint = async (req, res) => {

  try {

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

  const complaints = await Complaint.find()
    .populate("tenantId");

  res.json({
    success: true,
    complaints
  });

};


export const updateComplaint = async (req, res) => {

  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({
    success: true,
    complaint
  });

};