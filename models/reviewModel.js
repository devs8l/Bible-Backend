import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel;
    