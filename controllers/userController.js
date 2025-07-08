import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await userModel.findOne({ email });

    if (exists) return res.json({ success: false, message: "User already exists" });
    if (!validator.isEmail(email)) return res.json({ success: false, message: "Invalid email format" });
    if (password.length < 8) return res.json({ success: false, message: "Password must be at least 8 characters" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 1000 * 60 * 60 * 24; // 24 hours

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires: tokenExpiry
    });

    await newUser.save();
    await sendEmail({ email, token: verificationToken, type: "verify" });

    res.json({ success: true, message: "Verification email sent. Please check your inbox." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Verify Email
const verifyUser = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await userModel.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.json({ success: false, message: "Invalid or expired verification token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.json({ success: true, message: "Email verified successfully. You can now login." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.json({ success: false, message: "User not found" });
    if (!user.isVerified) return res.json({ success: false, message: "Please verify your email before logging in" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    const token = createToken(user._id);
    res.json({ success: true, token, name: user.name });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Resend Verification
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.isVerified) return res.json({ success: false, message: "Email is already verified" });

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 1000 * 60 * 60 * 24;
    user.verificationToken = token;
    user.verificationTokenExpires = expiry;
    await user.save();

    await sendEmail({ email, token, type: "verify" });

    return res.json({ success: true, message: "Verification email resent" });
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.json({ success: false, message: "User not found" });
    if (!user.isVerified) return res.json({ success: false, message: "Please verify your email first" });

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 1000 * 60 * 60;

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiry;
    await user.save();

    await sendEmail({ email, token, type: "reset" });

    res.json({ success: true, message: "Reset password email sent" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Server error" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.json({ success: false, message: "Invalid or expired token" });
    if (password.length < 8) return res.json({ success: false, message: "Password must be at least 8 characters" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Server error" });
  }
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ id: "admin", isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "1d" });
      return res.json({ success: true, token });
    }

    res.status(401).json({ success: false, message: "Invalid admin credentials" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  verifyUser,
  loginUser,
  adminLogin,
  resendVerification,
  forgotPassword,
  resetPassword
};
