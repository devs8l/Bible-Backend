import express from "express";
import {
  checkServiceability,
  calculateShipping,
  trackShipment,
  createPickupRequest,
  expectedTAT,
  createShipmentForOrder,
  getShipmentLabel,
} from "../controllers/delhiveryController.js"; // createShipment,
import { verifyAdmin } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/serviceability", checkServiceability);
router.get("/shipping-cost", calculateShipping);
router.get("/track", trackShipment);
router.get("/expected-tat", expectedTAT);
router.post("/pickup", verifyAdmin , createPickupRequest);
router.post("/:orderId/shipment", verifyAdmin, createShipmentForOrder);
router.get("/label/:awb", verifyAdmin,  getShipmentLabel);

// router.post("/create-shipment", createShipment);

export default router;
