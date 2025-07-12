/*import nodemailer from "nodemailer";

const sendEmail = async ({ email, token, type }) => {
  const isReset = type === "reset";
  const link = isReset
    ? `${process.env.BASE_URL}/reset-password/${token}`
    : `${process.env.BASE_URL}/verify/${token}`;

  const subject = isReset ? "Reset Your Password" : "Verify Your Email";
  const title = isReset ? "Password Reset Request" : "Welcome to Bible Bookstore";
  const description = isReset
    ? "Click the link below to reset your password:"
    : "Click the link below to verify your email address:";
  const expiryNote = isReset
    ? "This link will expire in 1 hour."
    : "This link will expire in 24 hours.";

  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE,
    port: process.env.EMAIL_PORT,
    secure: process.env.SECURE === "true",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    }
  });

  const mailOptions = {
    from: `"Bible Store" <${process.env.USER}>`,
    to: email,
    subject,
    html: `
      <h2>${title}</h2>
      <p>${description}</p>
      <a href="${link}">${link}</a>
      <p>${expiryNote}</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;*/

import nodemailer from "nodemailer";

const sendEmail = async ({ email, token, type }) => {
  const isReset = type === "reset";
  const link = isReset
    ? `${process.env.BASE_URL}/reset-password/${token}`
    : `${process.env.BASE_URL}/verify/${token}`;

  const subject = isReset ? "Reset Your Password" : "Verify Your Email";
  const title = isReset ? "🔐 Password Reset Request" : "🙏 Welcome to Centro Biblia";
  const actionText = isReset ? "Reset Your Password" : "Verify Your Email";
  const description = isReset
    ? "We received a request to reset your password. Click the button below to proceed:"
    : "We're excited to have you join us! Please verify your email address to get started:";
  const expiryNote = isReset
    ? "⏳ This link will expire in 1 hour for your security."
    : "⏳ This link will expire in 24 hours.";

  const verse = isReset
    ? "“Come to me, all who are weary and burdened, and I will give you rest.” – Matthew 11:28"
    : "“Your word is a lamp to my feet and a light to my path.” – Psalm 119:105";

  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE,
    port: process.env.EMAIL_PORT,
    secure: process.env.SECURE === "true",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    }
  });

  const mailOptions = {
    from: `"Centro Biblia" <${process.env.USER}>`,
    to: email,
    subject,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 24px; background-color: #f9f9f9;">
        <h2 style="color: #2c5282;">${title}</h2>
        <p style="font-size: 16px; color: #333;">${description}</p>
        <div style="margin: 24px 0;">
          <a href="${link}" style="background-color: #2c5282; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">${actionText}</a>
        </div>
        <p style="color: #555;">${expiryNote}</p>
        <blockquote style="margin-top: 30px; font-style: italic; color: #4a5568;">${verse}</blockquote>
        <hr style="margin-top: 40px;" />
        <p style="font-size: 14px; color: #888;">If you didn’t request this, you can safely ignore this email.</p>
        <p style="font-size: 14px; color: #888;">– Centro Biblia Team</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;

