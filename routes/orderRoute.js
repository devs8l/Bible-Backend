import express from "express"
import  { placedOrder, allOrders, userOrders, updateStatus} from "../controllers/orderController.js" // placedOrderRazorpay, verifyRazorpay 
import adminAuth from "../middleware/adminAuth.js"
import authUser from "../middleware/auth.js"
import productModel from "../models/productModel.js"
import sendDigitalCopy from "../utils/sendDigitalCopy.js"

const orderRouter = express.Router()

// Admin Features
orderRouter.post("/list", adminAuth,allOrders)
orderRouter.post("/status", adminAuth, updateStatus)

// Payment Features

orderRouter.post("/place",authUser, placedOrder)
//orderRouter.post("/razorpay", authUser, placedOrderRazorpay)

// User Features
orderRouter.post("/userOrders", authUser, userOrders)
orderRouter.post("/send-digital-copy", authUser, async (req, res) => {
  try {
    const { email, name, items } = req.body;

    for (const item of items) {
      const product = await productModel.findById(item.itemId);
      if (product?.digitalFile && item.format === "digital") {
        await sendDigitalCopy(email, name, product.digitalFile, product.name);
      }
    }

    res.json({ success: true, message: "Digital copies sent" });
  } catch (error) {
    console.error("Error in sending digital copy:", error);
    res.status(500).json({ success: false, message: "Failed to send digital copy" });
  }
});




// verify payment
//orderRouter.post("/verifyRazorpay", authUser, verifyRazorpay)

export default orderRouter;