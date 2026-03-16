import PG from "../models/pgModel.js";
import { getUploadPresignedUrl, getDownloadPresignedUrl } from "../utils/s3Config.js";

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
    const pg = await PG.findOne({ ownerId }).lean();

    if (pg && pg.images) {
      pg.images = await Promise.all(
        pg.images.map(async (img) => ({
          ...img,
          url: await getDownloadPresignedUrl(img.key),
        }))
      );
    }

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

export const getPGUploadUrl = async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    const ownerId = req.user.userId;
    const key = `pgs/${ownerId}/${Date.now()}-${fileName}`;

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

export const getAllPGs = async (req, res) => {
  try {
    const pgs = await PG.find().lean();

    const pgsWithUrls = await Promise.all(
      pgs.map(async (pg) => {
        if (pg.images && pg.images.length > 0) {
          pg.images = await Promise.all(
            pg.images.map(async (img) => ({
              ...img,
              url: await getDownloadPresignedUrl(img.key),
            }))
          );
        }
        return pg;
      })
    );

    res.json({
      success: true,
      pgs: pgsWithUrls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};