import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    thumbnailUrl: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    videoUrl: {
      type: String,
      required: true
    },
    views: {
      type: Number,
      default: 0
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    uploadDate: {
      type: Date,
      default: Date.now
    },
    category: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);
export default Video;