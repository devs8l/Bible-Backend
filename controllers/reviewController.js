import reviewModel from "../models/reviewModel.js";

// User submits a comment (requires login)
export const submitReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.userId;

    const newReview = await reviewModel.create({
      user: userId,
      product: productId,
      rating,
      comment
    });

    res.status(201).json({ message: "Review submitted for approval", review: newReview });
  } catch (error) {
    res.status(500).json({ error: "Error submitting review" });
  }
};

// Admin approves the comment
export const approveReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const updated = await reviewModel.findByIdAndUpdate(
      reviewId,
      { isApproved: true },
      { new: true }
    );

    res.json({ message: "Review approved", updated });
  } catch (error) {
    res.status(500).json({ error: "Error approving review" });
  }
};

// Get all reviews (for admin panel)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find()
      .populate("user", "name")
      .populate("product", "name");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// Get all approved reviews for a product
export const getApprovedReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await reviewModel.find({
      product: productId,
      isApproved: true
    }).populate("user", "name");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// Admin deletes a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    await reviewModel.findByIdAndDelete(reviewId);
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting review" });
  }
};

