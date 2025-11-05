export const customerOrderTemplate = (order, orderCode) => `
  <div style="font-family: 'Segoe UI', Roboto, sans-serif; background: #f9f9f9; padding: 0; margin: 0;">
    <table align="center" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
      <tr>
        <td style="background-color:#2674C3; padding: 25px; text-align: center; color: white;">
          <h2 style="margin: 0;">🛍️ Order Confirmation</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 30px; color: #333;">
          <p>Dear <strong>${order.name}</strong>,</p>
          <p>Thank you for your order! Your purchase has been successfully placed.</p>
          <div style="margin: 20px 0; background: #f6f6ff; border-left: 4px solid #4158D0; padding: 15px 20px; border-radius: 6px;">
            <p style="margin: 0;">🧾 <strong>Order ID:</strong> ${orderCode}</p>
            <p style="margin: 0;">💰 <strong>Amount:</strong> ₹${order.amount}</p>
            <p style="margin: 0;">🚚 <strong>Payment Method:</strong> ${order.paymentMethod}</p>
          </div>
          <p>We’ll notify you once your items are shipped.</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="https://bible-website-one.vercel.app/my-orders" 
              style="background-color:#2674C3; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: 600; display: inline-block;">
              View Your Orders
            </a>
          </div>
          <p>May God bless your day!</p>
          <p style="font-weight: 600;">– Centro Biblia Team</p>
        </td>
      </tr>
      <tr>
        <td style="background: #f3f3f3; padding: 20px; text-align: center; font-size: 12px; color: #777;">
          © ${new Date().getFullYear()} Centro Biblia. All rights reserved.
        </td>
      </tr>
    </table>
  </div>
`;

export const adminOrderTemplate = (order, orderCode) => `
  <div style="font-family: 'Segoe UI', Roboto, sans-serif; background: #fafafa; padding: 0; margin: 0;">
    <table align="center" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <tr>
        <td style="background-color:#2674C3; color: white; padding: 25px; text-align: center;">
          <h2 style="margin: 0;">📦 New Order Received</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 25px; color: #333; font-size: 16px; line-height: 1.6;">
          <p>Hello Admin,</p>
          <p>A new order has been placed on <strong>Centro Biblia</strong> 🎉</p>
          <div style="background: #f6f6ff; border-left: 4px solid #4158D0; padding: 15px; border-radius: 6px;">
            <p><strong>Order ID:</strong> ${orderCode}</p>
            <p><strong>Name:</strong> ${order.name}</p>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>Phone:</strong> ${order.phone}</p>
            <p><strong>Amount:</strong> ₹${order.amount}</p>
            <p><strong>Payment:</strong> ${order.paymentMethod} (${order.payment ? "Paid" : "Pending"})</p>
          </div>
          <div style="text-align: center; margin: 25px 0;">
            <a href="https://bible-admin-frontend.vercel.app/orders" 
              style="background-color:#2674C3; color: white; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: bold;">
              View Order in Dashboard
            </a>
          </div>
          <p>Keep up the great work! 💼</p>
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
