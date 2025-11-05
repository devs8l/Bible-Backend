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

    // 🌿 Beautiful Welcome Email
    const welcomeHTML = `
    <div style="font-family: 'Segoe UI', Roboto, sans-serif; background: #f9f9f9; padding: 0; margin: 0;">
      <table align="center" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
        <tr>
          <td style="background-color:#2674C3; padding: 30px; text-align: center; color: white;">
            <h2 style="margin: 0; font-size: 26px;">Welcome to Centro Biblia 🌿</h2>
          </td>
        </tr>
        <tr>
          <td style="padding: 30px 25px; color: #333;">
            <p style="font-size: 16px; line-height: 1.7;">
              Dear Beloved,
            </p>
            <p style="font-size: 16px; line-height: 1.7;">
              Thank you for subscribing to <strong>Centro Biblia</strong> — your trusted companion on your spiritual journey.
            </p>
            <blockquote style="margin: 20px 0; padding: 15px 20px; border-left: 4px solid #4158D0; background: #f3f6ff; font-style: italic; color: #222;">
              “Your word is a lamp to my feet and a light to my path.” — Psalm 119:105
            </blockquote>
            <p style="font-size: 16px; line-height: 1.7;">
              You’ll now receive:
            </p>
            <ul style="font-size: 16px; line-height: 1.7; padding-left: 20px;">
              <li>📖 Inspirational Bible verses</li>
              <li>📚 Updates on new Christian books</li>
              <li>✨ Faith-based devotionals and resources</li>
            </ul>
            <p style="margin-top: 25px; font-size: 16px; line-height: 1.7;">
              May God’s Word guide and bless you always.
            </p>
            <p style="margin-top: 20px; font-weight: 600;">
              In Christ,<br>
              <span style="color: #2674C3;">Centro Biblia Team</span>
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://centrobiblia.com" 
                style="background-color:#2674C3; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; display: inline-block;">
                Visit Centro Biblia
              </a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background: #f3f3f3; padding: 20px; text-align: center; font-size: 12px; color: #777;">
            Sent with ❤️ by Centro Biblia<br>
            © ${new Date().getFullYear()} Centro Biblia. All rights reserved.
          </td>
        </tr>
      </table>
    </div>
    `;

    await sendEmail({
      email,
      subject: "🌿 Welcome to the Centro Biblia Family!",
      html: welcomeHTML,
    });

    // 📬 Admin Notification Email (also styled)
    const adminHTML = `
    <div style="font-family: 'Segoe UI', Roboto, sans-serif; background: #f8f8f8; padding: 0; margin: 0;">
      <table align="center" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <tr>
          <td style="background: #2674C3; color: white; padding: 25px; text-align: center;">
            <h2 style="margin: 0;">📬 New Subscriber Notification</h2>
          </td>
        </tr>
        <tr>
          <td style="padding: 25px; color: #333; font-size: 16px; line-height: 1.6;">
            <p>Hello Admin,</p>
            <p>A new soul has joined our mailing list! ✨</p>
            <p style="background: #f3f6ff; border-left: 4px solid #4158D0; padding: 10px 15px; border-radius: 6px;">
              📧 <strong>Email:</strong> ${email}
            </p>
            <p>Keep spreading the Word with love.</p>
            <p style="margin-top: 20px; font-weight: 600;">– Centro Biblia System</p>
          </td>
        </tr>
        <tr>
          <td style="background: #f3f3f3; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            © ${new Date().getFullYear()} Centro Biblia
          </td>
        </tr>
      </table>
    </div>
    `;

    await sendEmail({
      email: process.env.USER,
      subject: "📬 New Subscriber Notification",
      html: adminHTML,
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
