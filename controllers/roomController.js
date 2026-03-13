import Room from "../models/roomModel.js";
import Bed from "../models/bedModel.js";

/* CREATE ROOM */

export const createRoom = async (req, res) => {
  try {

    const {
      pgId,
      roomNumber,
      floor,
      totalBeds,
      rentPerBed,
      securityDeposit,
      description
    } = req.body;

    const room = await Room.create({
      pgId,
      roomNumber,
      floor,
      totalBeds,
      rentPerBed,
      securityDeposit,
      description
    });

    /* Automatically create beds */

    const beds = [];

    for (let i = 1; i <= totalBeds; i++) {
      beds.push({
        roomId: room._id,
        bedNumber: i,
        status: "VACANT"
      });
    }

    await Bed.insertMany(beds);

    res.status(201).json({
      success: true,
      message: "Room created and beds generated successfully",
      room
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* GET ALL ROOMS */

export const getRooms = async (req, res) => {

  try {

    const rooms = await Room.find();

    res.json({
      success: true,
      rooms
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


/* GET ROOM BY ID */

export const getRoomById = async (req, res) => {

  try {

    const { roomId } = req.params;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    res.json({
      success: true,
      room
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


/* UPDATE ROOM */

export const updateRoom = async (req, res) => {

  try {

    const { roomId } = req.params;

    const room = await Room.findByIdAndUpdate(
      roomId,
      req.body,
      { new: true }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    res.json({
      success: true,
      message: "Room updated successfully",
      room
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


/* DELETE ROOM */

export const deleteRoom = async (req, res) => {

  try {

    const { roomId } = req.params;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    await Room.findByIdAndDelete(roomId);

    /* Delete all beds in that room */

    await Bed.deleteMany({ roomId });

    res.json({
      success: true,
      message: "Room and beds deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }


};
export const roomAvailability = async (req, res) => {

  try {

    const availableBeds = await Bed.find({
      status: "VACANT"
    }).populate("roomId");

    res.json({
      success: true,
      availableBeds
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};