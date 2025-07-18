import nodemailer from "nodemailer";

// Send Email with Digital Copy
const sendDigitalCopy = async (email, name, digitalFileUrl, productName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: `"Bible Store" <${process.env.USER}>`,
      to: email,
      subject: `Your Digital Book: ${productName}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>Hi ${name},</h2>
          <p>Thank you for purchasing <strong>${productName}</strong> from Bible Store.</p>
          <p>Your digital copy is attached below. You can also <a href="${digitalFileUrl}">download it directly here</a>.</p>
          <br/>
          <p>Blessings,</p>
          <p><strong>Bible Store Team</strong></p>
        </div>
      `,
      attachments: [
        {
          filename: `${productName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
          path: digitalFileUrl,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};


export default sendDigitalCopy;