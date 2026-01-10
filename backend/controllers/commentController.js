import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

export const getCommentsForVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const comments = await Comment.find({ video: videoId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });
    return res.json(comments);
  } catch (error) {
    console.error("GetComments error:", error.message);
    return res.status(500).json({ message: "Server error while fetching comments." });
  }
};

export const addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "Comment text is required." });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found." });
    }

    const comment = await Comment.create({
      video: videoId,
      user: req.user._id,
      text
    });

    const populated = await comment.populate("user", "username avatar");

    return res.status(201).json({ message: "Comment added.", comment: populated });
  } catch (error) {
    console.error("AddComment error:", error.message);
    return res.status(500).json({ message: "Server error while adding comment." });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "Comment text is required." });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    if (String(comment.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only edit your own comments." });
    }

    comment.text = text;
    await comment.save();

    const populated = await comment.populate("user", "username avatar");

    return res.json({ message: "Comment updated.", comment: populated });
  } catch (error) {
    console.error("UpdateComment error:", error.message);
    return res.status(500).json({ message: "Server error while updating comment." });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    if (String(comment.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only delete your own comments." });
    }

    await comment.deleteOne();

    return res.json({ message: "Comment deleted." });
  } catch (error) {
    console.error("DeleteComment error:", error.message);
    return res.status(500).json({ message: "Server error while deleting comment." });
  }
};