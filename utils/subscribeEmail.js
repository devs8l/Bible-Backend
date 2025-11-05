import nodemailer from "nodemailer";

const subscribeEmail = async ({ email, subject, message, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.EMAIL_PORT || 465,
      secure: process.env.SECURE === "true",
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: `"Centro Biblia" <${process.env.USER}>`,
      to: email,
      subject,
      text: message, 
      html: html || `<p>${message}</p>`, 
    });

    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
  }
};

export default subscribeEmail;
