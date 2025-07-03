import express from "express"
import  { placedOrder, allOrders, userOrders, updateStatus} from "../controllers/orderController.js" // placedOrderRazorpay, verifyRazorpay 
import adminAuth from "../middleware/adminAuth.js"
import authUser from "../middleware/auth.js"

const orderRouter = express.Router()

// Admin Features
orderRouter.post("/list", adminAuth,allOrders)
orderRouter.post("/status", adminAuth, updateStatus)

// Payment Features

orderRouter.post("/place",authUser, placedOrder)
//orderRouter.post("/razorpay", authUser, placedOrderRazorpay)

// User Features
orderRouter.post("/userOrders", authUser, userOrders)

// verify payment
//orderRouter.post("/verifyRazorpay", authUser, verifyRazorpay)

export default orderRouter;