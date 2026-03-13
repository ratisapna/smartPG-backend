import ExitRequest from "../models/exitrequestModel.js";
import Tenant from "../models/tenantModel.js";
import Bed from "../models/bedModel.js";


/* CREATE EXIT REQUEST */

export const createExitRequest = async (req, res) => {

  try {

    const exitRequest = await ExitRequest.create(req.body);

    res.status(201).json({
      success: true,
      message: "Exit request submitted",
      exitRequest
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



/* GET ALL EXIT REQUESTS */

export const getExitRequests = async (req, res) => {

  try {

    const requests = await ExitRequest.find()
      .populate("tenantId");

    res.json({
      success: true,
      requests
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



/* UPDATE EXIT REQUEST */

export const updateExitRequest = async (req, res) => {

  try {

    const request = await ExitRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    request.status = req.body.status;

    await request.save();

    /* If approved, free bed and deactivate tenant */

    if (request.status === "APPROVED") {

      const tenant = await Tenant.findById(request.tenantId);

      await Bed.findByIdAndUpdate(tenant.bedId, {
        status: "VACANT"
      });

      tenant.status = "INACTIVE";

      await tenant.save();
    }

    res.json({
      success: true,
      message: "Exit request updated",
      request
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};