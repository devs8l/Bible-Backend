import mongoose from "mongoose";

const offeringSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    amount: { type: Number, required: true },
    orderId: { type: String },
    paymentId: { type: String },
    paymentStatus: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Offering", offeringSchema);
