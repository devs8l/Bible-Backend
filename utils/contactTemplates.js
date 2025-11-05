export const contactAdminTemplate = (data) => `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa; padding: 30px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); overflow: hidden;">
      
      <!-- Header -->
      <div style="background-color:#2674C3; padding: 24px 20px; text-align: center;">
        <h2 style="color: #fff; margin: 0; font-size: 22px;">📬 New Contact Form Submission</h2>
      </div>

      <!-- Body -->
      <div style="padding: 28px 24px; color: #333;">
        <p style="font-size: 16px;">Hello Admin,</p>
        <p style="font-size: 15px;">A new contact form has been submitted on <strong>Centro Biblia</strong>.</p>

        <table cellpadding="6" cellspacing="0" style="width: 100%; margin-top: 10px; border-collapse: collapse;">
          <tr><td style="font-weight: bold;">👤 Name:</td><td>${data.name}</td></tr>
          <tr><td style="font-weight: bold;">📧 Email:</td><td>${data.email}</td></tr>
          <tr><td style="font-weight: bold;">📞 Phone:</td><td>${data.phone || "N/A"}</td></tr>
          <tr><td style="font-weight: bold;">📝 Subject:</td><td>${data.subject}</td></tr>
        </table>

        <div style="margin-top: 20px; background: #f7f8fa; padding: 16px; border-left: 4px solid #4158D0; border-radius: 6px;">
          <p style="margin: 0; font-style: italic;">"${data.message}"</p>
        </div>

        <p style="font-size: 13px; margin-top: 25px; color: #777;">🕒 Submitted on: ${new Date(data.createdAt).toLocaleString()}</p>

        <div style="margin-top: 30px; text-align: center;">
          <a href="mailto:${data.email}" 
             style="background-color: #4158D0; color: #fff; text-decoration: none; padding: 12px 26px; border-radius: 6px; font-weight: 600; display: inline-block;">
            📩 Reply to ${data.name}
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #fafafa; text-align: center; padding: 16px; font-size: 13px; color: #999;">
        Centro Biblia Admin Notification
      </div>
    </div>
  </div>
`;

export const contactUserTemplate = (data) => `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa; padding: 30px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); overflow: hidden;">
      
      <!-- Header -->
      <div style="background-color:#2674C3; padding: 24px 20px; text-align: center;">
        <h2 style="color: #fff; margin: 0; font-size: 22px;">Thank You for Contacting Centro Biblia!</h2>
      </div>

      <!-- Body -->
      <div style="padding: 28px 24px; color: #333;">
        <p style="font-size: 16px;">Hi <strong>${data.name}</strong>,</p>
        <p style="font-size: 15px;">We’ve received your message and our team will get back to you soon.</p>

        <div style="margin: 20px 0; padding: 14px; background: #f7f8fa; border-left: 4px solid #4158D0; border-radius: 6px;">
          <p style="margin: 0; font-size: 15px;"><strong>Your Message:</strong></p>
          <p style="margin: 5px 0 0; color: #555; font-style: italic;">"${data.message}"</p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="mailto:messenger@centrobiblia.com"
             style="background-color: #2674C3; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: 600; display: inline-block;">
            📧 Contact Support
          </a>
        </div>

        <p style="font-size: 14px; margin-top: 30px; color: #555;">
          We’re grateful for your trust in Centro Biblia and look forward to assisting you soon.
        </p>

        <p style="margin-top: 20px;">Blessings,<br><strong>Centro Biblia Support Team</strong></p>
      </div>

      <!-- Footer -->
      <div style="background: #fafafa; text-align: center; padding: 16px; font-size: 13px; color: #999;">
        © ${new Date().getFullYear()} Centro Biblia. All rights reserved.
      </div>
    </div>
  </div>
`;
