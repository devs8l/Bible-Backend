// routes/delhiveryRouter.js
import express from "express";
import {
  checkServiceability,
  calculateShipping,
  trackShipment,
  createPickupRequest,
  expectedTAT,
  createShipment,
} from "../controllers/delhiveryController.js";

const router = express.Router();

router.get("/serviceability", checkServiceability);
router.get("/shipping-cost", calculateShipping);
router.get("/track", trackShipment);
router.post("/pickup", createPickupRequest);
router.get("/expected-tat", expectedTAT);
router.post("/create-shipment", createShipment);

export default router;
