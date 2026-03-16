import Room from "../models/roomModel.js";
import Bed from "../models/bedModel.js";
import PG from "../models/pgModel.js";
import Activity from "../models/activityModel.js";
import { getUploadPresignedUrl, getDownloadPresignedUrl } from "../utils/s3Config.js";

/* CREATE ROOM */

export const createRoom = async (req, res) => {
  try {

    const ownerId = req.user.userId;
    const pg = await PG.findOne({ ownerId });

    if (!pg) {
      return res.status(404).json({ success: false, message: "No PG found for this owner" });
    }

    const { roomNumber, floor, totalBeds, rentPerBed, securityDeposit, description, images } = req.body;

    const room = await Room.create({
      pgId: pg._id,
      roomNumber,
      floor,
      totalBeds,
      rentPerBed,
      securityDeposit,
      description,
      images
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

    await Activity.create({
      userId: ownerId,
      pgId: pg._id,
      type: "ROOM_CREATED",
      message: `New room ${roomNumber} created with ${totalBeds} beds`
    });

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
    const ownerId = req.user.userId;
    const pg = await PG.findOne({ ownerId });

    if (!pg) {
      return res.json({ success: true, rooms: [] });
    }

    const rooms = await Room.find({ pgId: pg._id }).lean();

    const roomsWithDetails = await Promise.all(
      rooms.map(async (room) => {
        // Fetch beds for this room
        const beds = await Bed.find({ roomId: room._id }).populate("residentId", "name email phone");
        
        room.vacantBeds = beds.filter(b => b.status === "VACANT").length;
        room.occupiedBeds = beds.filter(b => b.status === "OCCUPIED");
        room.beds = beds;

        if (room.images && room.images.length > 0) {
          room.images = await Promise.all(
            room.images.map(async (img) => ({
              ...img,
              url: await getDownloadPresignedUrl(img.key),
            }))
          );
        }
        return room;
      })
    );

    res.json({
      success: true,
      rooms: roomsWithDetails
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

    const room = await Room.findById(roomId).populate({
      path: "pgId",
      populate: { path: "ownerId", select: "name email phone" }
    });

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
export const getPublicRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("pgId");
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
export const roomAvailability = async (req, res) => {

  try {

    const ownerId = req.user.userId;
    const pg = await PG.findOne({ ownerId });

    if (!pg) {
      return res.json({ success: true, availableBeds: [] });
    }

    const rooms = await Room.find({ pgId: pg._id }).distinct("_id");

    const availableBeds = await Bed.find({
      roomId: { $in: rooms },
      $or: [
        { status: "VACANT" },
        { status: { $exists: false } }
      ]
    }).populate("roomId", "roomNumber floor rentPerBed");

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

export const getRoomUploadUrl = async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    const key = `rooms/${Date.now()}-${fileName}`;
    const uploadUrl = await getUploadPresignedUrl(key, fileType);

    res.json({
      success: true,
      uploadUrl,
      key
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};