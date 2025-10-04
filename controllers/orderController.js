import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import razorpay from "razorpay"
import crypto from "crypto";


// gateway initialize
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, 
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})



// Placing orders using COD Method
const placedOrder = async (req, res) => {
  try {
    const { userId, name, email, phone, items, amount, address } = req.body;

    const orderData = {
      userId,
      name,
      email,
      phone,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    // Save order
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // 1. Reduce stock for each ordered item
    for (const item of items) {
      const product = await productModel.findById(item.itemId);
      if (product) {
        product.stock = Math.max(product.stock - item.quantity, 0); // Avoid negative stock
        await product.save();
      }
    }

    // 2. Remove ordered items from user's cart
    const user = await userModel.findById(userId);
    if (user && user.cartData) {
      const updatedCart = { ...user.cartData };
      items.forEach(item => {
        delete updatedCart[item.itemId]; // Remove only ordered items
      });
      await userModel.findByIdAndUpdate(userId, { cartData: updatedCart });
    }

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log("Order placement error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Place Order Razorpay Payment

const placedOrderRazorpay = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"), 
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    res.json({
      success: true,
      order: razorpayOrder,
    });
  } catch (error) {
    console.log("Razorpay Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Razorpay Payment

const verifyRazorpay = async (req, res) => {
  try {
    const {
      userId,
      name,
      email,
      phone,
      items,
      amount,
      address,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // 1️⃣ Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment Verification Failed" });
    }

    // 2️⃣ Payment verified → create order in MongoDB
    const orderData = {
      userId,
      name,
      email,
      phone,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: true,
      date: Date.now(),
      razorpay_order_id,
      razorpay_payment_id,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // 3️⃣ Reduce stock for each ordered item
    for (const item of items) {
      const product = await productModel.findById(item.itemId);
      if (product) {
        product.stock = Math.max(product.stock - (item.quantity ?? 1), 0); // prevent negative stock
        await product.save();
      }
    }

    // 4️⃣ Remove ordered items from user's cart (only purchased items)
    const user = await userModel.findById(userId);
    if (user && user.cartData) {
      const updatedCart = { ...user.cartData };
      items.forEach((item) => {
        delete updatedCart[item.itemId]; 
      });
      await userModel.findByIdAndUpdate(userId, { cartData: updatedCart });
    }

    res.json({
      success: true,
      message: "Payment Successful & Order Placed",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.log("Verify & Place Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// All order data for Admin Panel
const allOrders = async (req, res) => {
    try {

        const orders = await orderModel.find({})
        res.json({success: true, orders})

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// User data for frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;

        const orders = await orderModel.find({ userId })
        res.json({success: true, orders})

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Update order Status from admin panel
const updateStatus = async (req, res) => {
        try {
            
            const { orderId ,  status } = req.body;


            await orderModel.findByIdAndUpdate(orderId, { status })
            res.json({ success: true, message: "Status Updated"})

        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error.message });
        }
}


export {  placedOrder, allOrders, userOrders, updateStatus, placedOrderRazorpay,  verifyRazorpay} 
