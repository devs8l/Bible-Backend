import sendEmail from "../utils/subscribeEmail.js";
import Subscriber from "../models/Subscriber.js";

export const subscribeHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.json({
        success: false,
        message: "You’re already subscribed to Centro Biblia.",
      });
    }

    await Subscriber.create({ email });

    await sendEmail({
      email,
      subject: "Welcome to the Centro Biblia Family!",
      message: `
Dear Beloved,

Thank you for subscribing to Centro Biblia — your trusted companion on your spiritual journey.

🌿 “Your word is a lamp to my feet and a light to my path.” — Psalm 119:105

You’ll now receive:
• 📖 Inspirational Bible verses
• 📚 Updates on new Christian books
• ✨ Faith-based resources and devotionals

May God’s Word guide and bless you always.

In Christ,
Centro Biblia Team
      `.trim(),
    });

    await sendEmail({
      email: process.env.USER,
      subject: "📬 New Subscriber Notification",
      message: `
Hello Admin,

A new soul has joined our mailing list! ✨

📧 Email: ${email}

Keep spreading the Word with love.

– Centro Biblia System
      `.trim(),
    });

    res.json({
      success: true,
      message: "Subscription successful! Please check your inbox.",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Subscription failed. Please try again." });
  }
};
