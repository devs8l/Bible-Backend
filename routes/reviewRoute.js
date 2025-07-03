import express from "express";
import {
  submitReview,
  approveReview,
  getAllReviews,
  deleteReview,
  getApprovedReviews
} from "../controllers/reviewController.js";
import { verifyUser, verifyAdmin } from "../middleware/authMiddleware.js"; 

const router = express.Router();

//admin access

router.patch("/approve/:reviewId", verifyAdmin, approveReview);
router.get("/all", verifyAdmin, getAllReviews);
router.delete("/delete/:reviewId", verifyAdmin, deleteReview);

//user access
router.post("/submit", verifyUser, submitReview);
router.get("/:productId", getApprovedReviews);


export default router;
