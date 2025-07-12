import nodemailer from 'nodemailer';

const subscribeEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  await transporter.sendMail({
    from: `"Centro Biblia" <${process.env.MAIL_USER}>`,
    to: email,
    subject,
    text: message,
  });
};

export default subscribeEmail;
