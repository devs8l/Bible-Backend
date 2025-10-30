import express from "express";
import { getPaymentSettings, updatePaymentSettings } from "../controllers/paymentSettingsController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get current settings
router.get("/", verifyAdmin, getPaymentSettings);

// Update (Admin only)
router.put("/", verifyAdmin, updatePaymentSettings);

export default router;
