// routes/dailyVerse.js
import express from "express";
import { sendDailyVerseToSubscribers } from "../utils/dailyVerseEmail.js";

const router = express.Router();

// ✅ Manual trigger API
router.post("/send-daily-verse", async (req, res) => {
  try {
    await sendDailyVerseToSubscribers();
    res.status(200).json({ success: true, message: "Daily verse sent successfully!" });
  } catch (err) {
    console.error("❌ Error sending daily verse:", err.message);
    res.status(500).json({ success: false, message: "Failed to send daily verse." });
  }
});

export default router;
