import Razorpay from "razorpay";
import crypto from "crypto";
import Offering from "../models/offeringModel.js";
import userModel from "../models/userModel.js";
import sendOrderEmail from "../utils/sendOrderEmail.js"
import { offeringUserTemplate , offeringAdminTemplate } from "../utils/offeringTemplates.js";

// 🔐 Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🟢 1. Create Razorpay Order (no DB entry yet)
export const createOfferingOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user?.id || req.body.userId;

    if (!userId || !amount) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const order = await razorpay.orders.create({
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `offering_${Date.now()}`,
    });

    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      order,
      userDetails: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
  }
};

// 🟣 2. Verify Razorpay Payment (DB entry after success)
export const verifyOfferingPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      amount,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    const signBody = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(signBody)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // ✅ Create offering entry after payment success
    const offering = await Offering.create({
      user: userId,
      amount,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      paymentStatus: "paid",
      verified: true,
    });

    // ✅ Fetch user info
    const user = await User.findById(userId);
    if (user && user.email) {
      const formattedAmount = Number(amount).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });

      // Send email to user
      await sendOrderEmail({
        to: user.email,
        subject: "🙏 Thank You for Your Freewill Offering",
        html: offeringUserTemplate({
          name: user.name || "Beloved",
          amount: formattedAmount,
          paymentId: razorpay_payment_id,
        }),
      });

      // Send email to admin
      await sendOrderEmail({
        to: process.env.USER,
        subject: "📬 New Freewill Offering Received",
        html: offeringAdminTemplate({
          name: user.name || "Anonymous",
          email: user.email,
          amount: formattedAmount,
          paymentId: razorpay_payment_id,
        }),
      });
    }

    res.status(200).json({ success: true, offering });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};

// 🟠 Get all offerings (admin)
export const getAllOfferings = async (req, res) => {
  try {
    const offerings = await Offering.find()
      .populate("user", "name email phone profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, total: offerings.length, offerings });
  } catch (error) {
    console.error("Error fetching all offerings:", error);
    res.status(500).json({ success: false, message: "Failed to fetch offerings" });
  }
};

// 🔵 Get offerings for a single user
export const getUserOfferings = async (req, res) => {
  try {
    const { userId } = req.params;
    const offerings = await Offering.find({ user: userId })
      .populate("user", "name email profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, offerings });
  } catch (error) {
    console.error("Error fetching user offerings:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user offerings" });
  }
};
