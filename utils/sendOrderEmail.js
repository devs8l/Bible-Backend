import nodemailer from "nodemailer";

const sendOrderEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.SECURE === "true",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  await transporter.sendMail({
    from: `"Centro Biblia Orders" <${process.env.USER}>`,
    to,
    subject,
    html,
  });
};

export default sendOrderEmail;
