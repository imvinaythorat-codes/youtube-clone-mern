import Channel from "../models/Channel.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const createChannel = async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;

    if (!channelName || channelName.trim().length < 3) {
      return res
        .status(400)
        .json({ message: "Channel name must be at least 3 characters long." });
    }

    const channel = await Channel.create({
      channelName,
      description: description || "",
      channelBanner: channelBanner || "",
      owner: req.user._id
    });

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { channels: channel._id }
    });

    return res.status(201).json({ message: "Channel created successfully.", channel });
  } catch (error) {
    console.error("CreateChannel error:", error.message);
    return res.status(500).json({ message: "Server error while creating channel." });
  }
};

export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate("owner", "username email")
      .populate("videos");
    if (!channel) {
      return res.status(404).json({ message: "Channel not found." });
    }
    return res.json(channel);
  } catch (error) {
    console.error("GetChannel error:", error.message);
    return res.status(500).json({ message: "Server error while fetching channel." });
  }
};

export const getChannelVideos = async (req, res) => {
  try {
    const channelId = req.params.id;
    const videos = await Video.find({ channel: channelId }).sort({ createdAt: -1 });
    return res.json(videos);
  } catch (error) {
    console.error("GetChannelVideos error:", error.message);
    return res.status(500).json({ message: "Server error while fetching channel videos." });
  }
};