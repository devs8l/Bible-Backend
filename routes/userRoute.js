import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
  registerUser,
  verifyUser,
  loginUser,
  adminLogin,
  resendVerification,
  forgotPassword,
  resetPassword, getAllUsers, getUserProfile, updateUserProfile,
} from "../controllers/userController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js"
import authUser from "../middleware/auth.js"
import upload from "../middleware/multer.js";
import "../config/passport.js";

const userRouter = express.Router();

userRouter.use(passport.initialize());
userRouter.use(passport.session());

userRouter.post("/register", upload.single("profilePic"), registerUser);
userRouter.get("/verify/:token", verifyUser);
userRouter.post("/resend-verification", resendVerification);
userRouter.post("/login", loginUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);
userRouter.get("/profile", authUser, getUserProfile);
userRouter.put("/profile", authUser, upload.single("profilePic"), updateUserProfile);


userRouter.post("/admin", adminLogin);
userRouter.get("/admin/users", verifyAdmin,  getAllUsers);

// ------------------ GOOGLE AUTH ------------------

// Step 1: Google Auth Start
userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Google Auth Callback
userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  async (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin || false },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Redirect to frontend with token and user info
    res.redirect(`${process.env.FRONTEND_URL}/login/success?token=${token}&name=${encodeURIComponent(user.name)}&_id=${user._id}`);
  }
);

export default userRouter;