import express from "express";
import {
  createImageTitle,
  getAllImageTitles,
  getImageTitle,
  updateImageTitle,
  deleteImageTitle,
} from "../../controllers/BibleArticlesControllers/imageTitleController.js";
import upload from "../../middleware/multer.js";
import { verifyAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/image-titles - Create new entry
router.post("/", upload.single("image"), verifyAdmin, createImageTitle);

// GET /api/image-titles - Get all entries
router.get("/", getAllImageTitles);

// GET /api/image-titles/:id - Get single entry
router.get("/:id", getImageTitle);

// PUT /api/image-titles/:id - Update entry
router.put("/:id", upload.single("image"), verifyAdmin, updateImageTitle);

// DELETE /api/image-titles/:id - Delete entry
router.delete("/:id", verifyAdmin, deleteImageTitle);

export default router;