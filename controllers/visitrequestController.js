import VisitRequest from "../models/visitrequestModel.js";


/* CREATE VISIT REQUEST */

export const createVisitRequest = async (req, res) => {

  try {

    const visit = await VisitRequest.create(req.body);

    res.status(201).json({
      success: true,
      message: "Visit request submitted",
      visit
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



/* GET ALL VISIT REQUESTS */

export const getVisitRequests = async (req, res) => {

  try {

    const visits = await VisitRequest.find()
      .populate("pgId");

    res.json({
      success: true,
      visits
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



/* UPDATE VISIT STATUS */

export const updateVisitStatus = async (req, res) => {

  try {

    const visit = await VisitRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Visit request updated",
      visit
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};