import PG from "../models/pgModel.js";

export const createPG = async (req, res) => {
  try {

    const ownerId = req.user.userId;

    const pg = await PG.create({
      ...req.body,
      ownerId
    });

    res.status(201).json({
      success: true,
      message: "PG created successfully",
      pg
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


export const getPG = async (req, res) => {

  try {

    const ownerId = req.user.userId;

    const pg = await PG.findOne({ ownerId });

    res.json({
      success: true,
      pg
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


export const updatePG = async (req, res) => {

  try {

    const ownerId = req.user.userId;

    const pg = await PG.findOneAndUpdate(
      { ownerId },
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "PG updated successfully",
      pg
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


export const deletePG = async (req, res) => {

  try {

    const ownerId = req.user.userId;

    await PG.findOneAndDelete({ ownerId });

    res.json({
      success: true,
      message: "PG deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};