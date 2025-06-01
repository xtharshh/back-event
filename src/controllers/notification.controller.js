import { Notification } from "../models/notification.model.js";

export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
      seen: false,
    });

    // Mark as seen
    await Notification.updateMany(
      { userId: req.user._id, seen: false },
      { $set: { seen: true } }
    );

    return res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
