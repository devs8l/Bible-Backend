import express from "express";
import passport from "passport";
import {
  registerUser,
  verifyUser,
  loginUser,
  adminLogin,
  resendVerification,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";


import "../config/passport.js";

const userRouter = express.Router();

userRouter.use(passport.initialize());
userRouter.use(passport.session());

userRouter.post("/register", registerUser);
userRouter.get("/verify/:token", verifyUser);
userRouter.post("/resend-verification", resendVerification);
userRouter.post("/login", loginUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);
userRouter.post("/admin", adminLogin);

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
