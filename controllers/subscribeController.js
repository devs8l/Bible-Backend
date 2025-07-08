import sendEmail from "../utils/subscribeEmail.js";

export const subscribeHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    // ✉️ Email to Subscriber
    await sendEmail({
      email,
      subject: "Welcome to the Bible Bookstore Family!",
      message: `
Dear Beloved,

Thank you for subscribing to Bible Bookstore — your trusted companion on your spiritual journey.

🌿 “Your word is a lamp to my feet and a light to my path.” — Psalm 119:105

You’ll now receive:
• 📖 Inspirational Bible verses
• 📚 Updates on new Christian books
• ✨ Faith-based resources and devotionals

May God’s Word guide and bless you always.

In Christ,
Bible Bookstore Team
      `.trim(),
    });

    // 📩 Email to Admin
    await sendEmail({
      email: process.env.USER,
      subject: "📬 New Subscriber Notification",
      message: `
Hello Admin,

A new soul has joined our mailing list! ✨

📧 Email: ${email}

Keep spreading the Word with love.

– Bible Bookstore System
      `.trim(),
    });

    res.json({ success: true, message: "Subscription successful! Please check your inbox." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Subscription failed. Please try again." });
  }
};
