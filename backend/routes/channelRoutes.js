import express from "express";
import {
  createChannel,
  getChannelById,
  getChannelVideos
} from "../controllers/channelController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createChannel);
router.get("/:id", getChannelById);
router.get("/:id/videos", getChannelVideos);

export default router;