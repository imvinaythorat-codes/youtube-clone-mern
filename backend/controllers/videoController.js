import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

export const getAllVideos = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (category) {
      filter.category = category;
    }

    const videos = await Video.find(filter)
      .populate("channel", "channelName")
      .sort({ createdAt: -1 });

    return res.json(videos);
  } catch (error) {
    console.error("GetAllVideos error:", error.message);
    return res.status(500).json({ message: "Server error while fetching videos." });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate(
      "channel",
      "channelName"
    );
    if (!video) {
      return res.status(404).json({ message: "Video not found." });
    }

    video.views += 1;
    await video.save();

    return res.json(video);
  } catch (error) {
    console.error("GetVideoById error:", error.message);
    return res.status(500).json({ message: "Server error while fetching video." });
  }
};

export const createVideo = async (req, res) => {
  try {
    const { title, description, thumbnailUrl, videoUrl, channelId, category } = req.body;

    if (!title || !thumbnailUrl || !videoUrl || !channelId || !category) {
      return res.status(400).json({
        message: "title, thumbnailUrl, videoUrl, channelId and category are required."
      });
    }

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found." });
    }

    if (String(channel.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only upload videos to your own channel." });
    }

    const video = await Video.create({
      title,
      description: description || "",
      thumbnailUrl,
      videoUrl,
      channel: channelId,
      uploader: req.user._id,
      category
    });

    channel.videos.push(video._id);
    await channel.save();

    return res.status(201).json({ message: "Video created successfully.", video });
  } catch (error) {
    console.error("CreateVideo error:", error.message);
    return res.status(500).json({ message: "Server error while creating video." });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found." });
    }

    if (String(video.uploader) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only edit your own videos." });
    }

    const { title, description, thumbnailUrl, videoUrl, category } = req.body;

    if (title !== undefined) video.title = title;
    if (description !== undefined) video.description = description;
    if (thumbnailUrl !== undefined) video.thumbnailUrl = thumbnailUrl;
    if (videoUrl !== undefined) video.videoUrl = videoUrl;
    if (category !== undefined) video.category = category;

    await video.save();

    return res.json({ message: "Video updated successfully.", video });
  } catch (error) {
    console.error("UpdateVideo error:", error.message);
    return res.status(500).json({ message: "Server error while updating video." });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found." });
    }

    if (String(video.uploader) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only delete your own videos." });
    }

    await video.deleteOne();

    await Channel.updateOne(
      { _id: video.channel },
      { $pull: { videos: video._id } }
    );

    return res.json({ message: "Video deleted successfully." });
  } catch (error) {
    console.error("DeleteVideo error:", error.message);
    return res.status(500).json({ message: "Server error while deleting video." });
  }
};

export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found." });
    }

    const userId = String(req.user._id);

    if (!video.likes.map((id) => String(id)).includes(userId)) {
      video.likes.push(userId);
    }

    video.dislikes = video.dislikes.filter((id) => String(id) !== userId);

    await video.save();

    return res.json({
      message: "Video liked.",
      likesCount: video.likes.length,
      dislikesCount: video.dislikes.length
    });
  } catch (error) {
    console.error("LikeVideo error:", error.message);
    return res.status(500).json({ message: "Server error while liking video." });
  }
};

export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found." });
    }

    const userId = String(req.user._id);

    if (!video.dislikes.map((id) => String(id)).includes(userId)) {
      video.dislikes.push(userId);
    }

    video.likes = video.likes.filter((id) => String(id) !== userId);

    await video.save();

    return res.json({
      message: "Video disliked.",
      likesCount: video.likes.length,
      dislikesCount: video.dislikes.length
    });
  } catch (error) {
    console.error("DislikeVideo error:", error.message);
    return res.status(500).json({ message: "Server error while disliking video." });
  }
};