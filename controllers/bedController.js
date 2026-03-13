import Bed from "../models/bedModel.js";

/* Get beds of a room */

export const getBedsByRoom = async (req, res) => {

  try {

    const { roomId } = req.params;

    const beds = await Bed.find({ roomId });

    res.json({
      success: true,
      beds
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


/* Update bed */

export const updateBed = async (req, res) => {

  try {

    const { bedId } = req.params;

    const bed = await Bed.findByIdAndUpdate(
      bedId,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Bed updated successfully",
      bed
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


/* Delete bed */

export const deleteBed = async (req, res) => {

  try {

    const { bedId } = req.params;

    await Bed.findByIdAndDelete(bedId);

    res.json({
      success: true,
      message: "Bed deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};