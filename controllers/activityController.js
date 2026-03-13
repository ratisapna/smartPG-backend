import Activity from "../models/activityModel.js";

export const getRecentActivity = async (req, res) => {

  try {

    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      activities
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};