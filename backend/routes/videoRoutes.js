import express from "express";
import {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo
} from "../controllers/videoController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: list videos with search & category filters
router.get("/", getAllVideos);

// Public: get single video
router.get("/:id", getVideoById);

// Protected: create, update, delete, like/dislike
router.post("/", authMiddleware, createVideo);
router.put("/:id", authMiddleware, updateVideo);
router.delete("/:id", authMiddleware, deleteVideo);

router.post("/:id/like", authMiddleware, likeVideo);
router.post("/:id/dislike", authMiddleware, dislikeVideo);

export default router;