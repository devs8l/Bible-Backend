import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import razorpay from "razorpay";
import crypto from "crypto";
import delhiveryAPI from "../utils/delhiveryService.js"; // ✅ Import Delhivery API instance

// ✅ Razorpay Gateway Initialization
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🧩 Helper: Create Delhivery Shipment Automatically
const createDelhiveryShipment = async (orderData) => {
  try {
    const shipmentPayload = {
      name: orderData.name,
      add: orderData.address.street || orderData.address.addressLine || "Address not provided",
      pin: orderData.address.pincode || orderData.address.pin,
      city: orderData.address.city,
      state: orderData.address.state,
      country: "India",
      phone: orderData.phone,
      order: orderData._id.toString(),
      payment_mode: orderData.payment ? "Prepaid" : "COD",
      total_amount: orderData.amount,
      products_desc: orderData.items.map((i) => i.name).join(", "),
      shipment_height: "10",
      shipment_width: "10",
      weight: "500", // grams
      shipping_mode: "Surface",
    };

    const response = await delhiveryAPI.post(`/api/cmu/create.json`, {
      format: "json",
      data: {
        shipments: [shipmentPayload],
        pickup_location: { name: "warehouse_name" }, // Replace with your registered warehouse alias
      },
    });

    console.log("✅ Delhivery Shipment Created:", response.data);
    return response.data;
  } catch (err) {
    console.error("❌ Delhivery Shipment Creation Failed:", err.response?.data || err.message);
    return null;
  }
};

// ------------------------------------------------------------------------
// 🧾 1️⃣ COD Order Placement
export const placedOrder = async (req, res) => {
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

    // Reduce product stock
    for (const item of items) {
      const product = await productModel.findById(item.itemId);
      if (product) {
        product.stock = Math.max(product.stock - (item.quantity ?? 1), 0);
        await product.save();
      }
    }

    // Remove ordered items from user's cart
    const user = await userModel.findById(userId);
    if (user && user.cartData) {
      const updatedCart = { ...user.cartData };
      items.forEach((item) => delete updatedCart[item.itemId]);
      await userModel.findByIdAndUpdate(userId, { cartData: updatedCart });
    }

    // ✅ Auto Create Delhivery Shipment
    await createDelhiveryShipment(newOrder);

    res.json({ success: true, message: "Order Placed Successfully & Shipment Created" });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ------------------------------------------------------------------------
// 💳 2️⃣ Razorpay Order Creation
export const placedOrderRazorpay = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    res.json({ success: true, order: razorpayOrder });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ------------------------------------------------------------------------
// 🧾 3️⃣ Razorpay Payment Verification + Order Creation
export const verifyRazorpay = async (req, res) => {
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

    // Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment Verification Failed" });
    }

    // Save Verified Order
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

    // Reduce Stock
    for (const item of items) {
      const product = await productModel.findById(item.itemId);
      if (product) {
        product.stock = Math.max(product.stock - (item.quantity ?? 1), 0);
        await product.save();
      }
    }

    // Clear Cart
    const user = await userModel.findById(userId);
    if (user && user.cartData) {
      const updatedCart = { ...user.cartData };
      items.forEach((item) => delete updatedCart[item.itemId]);
      await userModel.findByIdAndUpdate(userId, { cartData: updatedCart });
    }

    // ✅ Auto Create Delhivery Shipment
    await createDelhiveryShipment(newOrder);

    res.json({
      success: true,
      message: "Payment Verified, Order Placed & Shipment Created",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Verify & Place Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ------------------------------------------------------------------------
// 🧾 4️⃣ Get All Orders (Admin)
export const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ------------------------------------------------------------------------
// 🧾 5️⃣ Get User Orders
export const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ------------------------------------------------------------------------
// 🧾 6️⃣ Update Order Status (Admin)
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Order Status Updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


