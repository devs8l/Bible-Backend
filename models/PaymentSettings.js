import mongoose from "mongoose";

const PaymentSettingsSchema = new mongoose.Schema({
  codEnabled: { type: Boolean, default: true },
  razorpayEnabled: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("PaymentSettings", PaymentSettingsSchema);
