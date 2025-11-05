import nodemailer from "nodemailer";

const sendDigitalCopy = async (email, name, digitalFileUrl, productName) => {
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

    const mailOptions = {
      from: `"Bible Store" <${process.env.USER}>`,
      to: email,
      subject: `📖 Your Digital Book: ${productName}`,
      html: `
      <div style="background-color:#f4f5f7; padding: 40px 20px; font-family: 'Segoe UI', Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <div style="background-color:#2674C3; padding: 30px 20px; text-align: center; color: #fff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Bible Store</h1>
            <p style="margin: 5px 0 0; font-size: 15px;">Your Faithful Source for Digital Scripture</p>
          </div>

          <!-- Body -->
          <div style="padding: 30px 20px; text-align: left;">
            <h2 style="font-size: 20px; color: #222;">Hi ${name},</h2>
            <p style="font-size: 15px; line-height: 1.6; margin: 15px 0;">
              Thank you for purchasing <strong>${productName}</strong> from <strong>Bible Store</strong>.  
              We’re delighted to send you your digital copy below.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://bible-backend-lake.vercel.app/api/order/download?file=${encodeURIComponent(digitalFileUrl)}&name=${encodeURIComponent(productName)}"
                style="background-color: #2674C3; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: 600; display: inline-block;">
                📥 Download Your Book
              </a>
            </div>

            <p style="font-size: 15px; color: #555; line-height: 1.6;">
              We pray this book enriches your spiritual journey and strengthens your faith in the Word of God.
            </p>

            <p style="margin-top: 25px; font-size: 15px;">
              Blessings,<br/>
              <strong>The Bible Store Team</strong><br/>
              <a href="https://centrobiblia.com" style="color:#2674C3; text-decoration:none;">www.centrobiblia.com</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f0f0f0; text-align: center; padding: 15px; font-size: 12px; color: #777;">
            <p style="margin: 0;">© ${new Date().getFullYear()} Bible Store. All Rights Reserved.</p>
          </div>

        </div>
      </div>
      `,
      attachments: [
        {
          filename: `${productName.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
          path: digitalFileUrl,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Digital copy email sent to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};

export default sendDigitalCopy;
