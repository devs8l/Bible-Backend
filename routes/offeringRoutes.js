import express from "express";
import {
  createOfferingOrder,
  verifyOfferingPayment,
  getUserOfferings,
  getAllOfferings,
} from "../controllers/offeringController.js";
import authUser from "../middleware/auth.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 Create Razorpay order (no DB entry)
router.post("/create-donation", authUser, createOfferingOrder);

// 🟣 Verify payment and save offering
router.post("/verify-payment", authUser, verifyOfferingPayment);

// 🟠 Get all offerings (admin)
router.get("/all", verifyAdmin, getAllOfferings);

// 🔵 Get offerings for one user
router.get("/user/:userId", authUser, getUserOfferings);

export default router;
