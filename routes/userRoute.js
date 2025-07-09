import express from "express";
import passport from "passport";
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

// Google Auth Route
userRouter.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Auth Callback
userRouter.get("/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
  }),
  (req, res) => {
    res.redirect(process.env.BASE_URL);
  }
);

export default userRouter;
