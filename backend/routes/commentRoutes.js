import express from "express";
import {
  getCommentsForVideo,
  addComment,
  updateComment,
  deleteComment
} from "../controllers/commentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Video-level routes
router.get("/video/:videoId", getCommentsForVideo);
router.post("/video/:videoId", authMiddleware, addComment);

// Comment-level routes
router.put("/:id", authMiddleware, updateComment);
router.delete("/:id", authMiddleware, deleteComment);

export default router;