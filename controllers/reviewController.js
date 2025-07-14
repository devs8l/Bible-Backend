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

// Get average rating for a product
export const getAverageRating = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await reviewModel.find({ product: productId, isApproved: true });

    if (reviews.length === 0) {
      return res.json({ average: 0, count: 0 });
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = total / reviews.length;

    res.json({ average: average.toFixed(1), count: reviews.length });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate average rating" });
  }
};


export const getReviewSummary = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId || productId === "undefined") {
      return res.status(400).json({ error: "Invalid or missing productId" });
    }

    const reviews = await reviewModel.find({ product: productId, isApproved: true });

    const count = reviews.length;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const average = count === 0 ? 0 : total / count;

    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
    });

    // convert to % of total
    Object.keys(breakdown).forEach((key) => {
      breakdown[key] = Math.round((breakdown[key] / count) * 100);
    });

    const fullReviews = await reviewModel
      .find({ product: productId, isApproved: true })
      .populate("user", "name");

    const reviewsFormatted = fullReviews.map((r) => ({
      name: r.user.name,
      rating: r.rating,
      comment: r.comment
    }));

    res.json({
      average: average.toFixed(1),
      count,
      breakdown,
      reviews: reviewsFormatted
    });
  } catch (err) {
    console.error("Review summary error:", err);
    res.status(500).json({ error: "Failed to fetch review summary" });
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

