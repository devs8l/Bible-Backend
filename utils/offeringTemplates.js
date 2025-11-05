export const offeringUserTemplate = ({ name, amount, paymentId }) => `
  <div style="font-family:'Helvetica Neue',Arial,sans-serif;background-color:#f5f7fa;padding:30px;">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.08);overflow:hidden;">
      
      <div style="background-color: #2674C3;padding:24px 20px;text-align:center;">
        <h2 style="color:#fff;margin:0;font-size:22px;">🙏 Thank You for Your Offering</h2>
      </div>

      <div style="padding:28px 24px;color:#333;">
        <p style="font-size:16px;">Hi <strong>${name}</strong>,</p>
        <p style="font-size:15px;">
          Your <strong>Freewill Offering</strong> has been received successfully.
          Your generous support helps us spread the Gospel and build generations grounded in Scripture.
        </p>

        <table cellpadding="6" cellspacing="0" style="width:100%;margin:18px 0;border-collapse:collapse;">
          <tr><td style="font-weight:bold;">💰 Amount:</td><td>${amount}</td></tr>
          <tr><td style="font-weight:bold;">🆔 Payment ID:</td><td>${paymentId}</td></tr>
          <tr><td style="font-weight:bold;">📅 Date:</td><td>${new Date().toLocaleString()}</td></tr>
        </table>

        <div style="text-align:center;margin-top:28px;">
          <a href="https://bible-website-one.vercel.app" style="background-color: #2674C3;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-weight:600;display:inline-block;">
            🌿 Visit Centro Biblia
          </a>
        </div>

        <p style="margin-top:28px;font-size:14px;color:#555;">
          “Each one must give as he has decided in his heart, not reluctantly or under compulsion,
          for God loves a cheerful giver.” — 2 Corinthians 9:7
        </p>

        <p style="margin-top:22px;">In Christ,<br><strong>Centro Biblia Team</strong></p>
      </div>

      <div style="background:#fafafa;text-align:center;padding:16px;font-size:13px;color:#999;">
        © ${new Date().getFullYear()} Centro Biblia. All rights reserved.
      </div>
    </div>
  </div>
`;

export const offeringAdminTemplate = ({ name, email, amount, paymentId }) => `
  <div style="font-family:'Helvetica Neue',Arial,sans-serif;background-color:#f5f7fa;padding:30px;">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.08);overflow:hidden;">

      <div style="background-color: #2674C3;padding:24px 20px;text-align:center;">
        <h2 style="color:#fff;margin:0;font-size:22px;">📬 New Freewill Offering Received</h2>
      </div>

      <div style="padding:28px 24px;color:#333;">
        <p style="font-size:15px;">Hello Admin,</p>
        <p style="font-size:15px;">A new offering has been received through Razorpay.</p>

        <table cellpadding="6" cellspacing="0" style="width:100%;margin-top:12px;border-collapse:collapse;">
          <tr><td style="font-weight:bold;">👤 Donor:</td><td>${name}</td></tr>
          <tr><td style="font-weight:bold;">📧 Email:</td><td>${email}</td></tr>
          <tr><td style="font-weight:bold;">💰 Amount:</td><td>${amount}</td></tr>
          <tr><td style="font-weight:bold;">🆔 Payment ID:</td><td>${paymentId}</td></tr>
        </table>

        <div style="margin-top:30px;text-align:center;">
          <a href="${process.env.ADMIN_PANEL_URL || 'https://bible-admin-frontend.vercel.app/freewill-offering'}"
             style="background-color: #2674C3;color:#fff;text-decoration:none;padding:12px 26px;border-radius:6px;font-weight:600;display:inline-block;">
            📊 View in Dashboard
          </a>
        </div>
      </div>

      <div style="background:#fafafa;text-align:center;padding:16px;font-size:13px;color:#999;">
        Centro Biblia Offering Notification
      </div>
    </div>
  </div>
`;
