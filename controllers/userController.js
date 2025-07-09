import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register User
/*const registerUser = async (req, res) => {
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
};*/

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // 1. Validate Inputs
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // 2. Upload profile picture to Cloudinary
    let profilePicUrl = "";
    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const uploadResult = await cloudinary.uploader.upload(base64Image, {
        folder: "users",
      });
      profilePicUrl = uploadResult.secure_url;
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 1000 * 60 * 60 * 24; // 24 hours

    // 5. Create and save new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      profilePic: profilePicUrl,
      verificationToken,
      verificationTokenExpires: tokenExpiry,
    });

    await newUser.save();

    // 6. Send verification email
    await sendEmail({
      email,
      token: verificationToken,
      type: "verify",
    });

    // 7. Respond success
    res.status(200).json({
      success: true,
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Registration failed. Try again later." });
  }
}

// GET profile
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch user profile" });
  }
};


// PUT update profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await userModel.findById(req.userId);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (name) user.name = name;
    if (phone) user.phone = phone;

    if (req.file) {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ success: false, message: "Image upload failed" });
          }

          user.profilePic = result.secure_url;
          await user.save();
          res.json({ success: true, message: "Profile updated", profilePic: result.secure_url });
        }
      );

      
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    } else {
      await user.save();
      res.json({ success: true, message: "Profile updated" });
    }
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, message: "Error updating profile" });
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
    res.json({ success: true, token, name: user.name, _id: user._id });
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

// Admin: Get All Users

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, "-password -verificationToken -resetPasswordToken -resetPasswordExpires -verificationTokenExpires");
    const totalUsers = users.length;
    res.json({ success: true, totalUsers, users });
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
  resetPassword, getAllUsers, getUserProfile ,  updateUserProfile,
};
