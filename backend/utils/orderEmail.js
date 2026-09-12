const sendEmail = require("./sendEmail");

/**
 * Send order confirmation notification to the customer.
 */
const sendOrderConfirmationEmail = async ({ order, user }) => {
  try {
    const customerEmail = user?.email || order?.user?.email;
    if (!customerEmail) {
      console.warn("[orderEmail] No customer email found for order:", order?._id);
      return;
    }

    const itemsHtml = (order.items || [])
      .map((item) => {
        const title = item.product?.title || item.name || "Product";
        const qty = item.quantity || 1;
        const price = Number(item.price || 0).toFixed(2);
        const itemTotal = (Number(item.price || 0) * qty).toFixed(2);

        return `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #ffffff; font-size: 13px;">
              <strong>${title}</strong><br/>
              <span style="font-size: 11px; color: #888888;">Qty: ${qty} × $${price}</span>
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); text-align: right; color: #00E5FF; font-size: 13px; font-weight: 600;">
              $${itemTotal}
            </td>
          </tr>
        `;
      })
      .join("");

    const orderId = String(order._id || "");
    const shortId = orderId ? orderId.slice(-8).toUpperCase() : "";
    const total = Number(order.total || 0).toFixed(2);
    const subtotal = Number(order.subtotal || 0).toFixed(2);
    const shippingFee = Number(order.shippingFee || 0);
    const shippingText = shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`;
    const paymentMethodText =
      order.paymentMethod === "card" ? "Credit / Debit Card (Stripe)" : "Cash on Delivery";

    const shipping = order.shippingAddress || {};
    const deliveryAddress = [shipping.address, shipping.city].filter(Boolean).join(", ");

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0b0b; color: #ffffff; margin: 0; padding: 20px; }
    .card { max-width: 540px; margin: 0 auto; background: #121212; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 32px; }
    .brand { font-size: 20px; font-weight: bold; letter-spacing: 0.2em; color: #ffffff; text-align: center; margin-bottom: 24px; }
    .cyan { color: #00E5FF; }
    .badge { display: inline-block; background: rgba(0,229,255,0.1); border: 1px solid rgba(0,229,255,0.3); color: #00E5FF; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
    .total-box { margin-top: 16px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.15); display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; color: #ffffff; }
    .footer { font-size: 11px; color: #666666; text-align: center; margin-top: 28px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">NEXA<span class="cyan">TECH</span></div>
    
    <div style="text-align: center; margin-bottom: 24px;">
      <div class="badge">Order Confirmed</div>
      <h2 style="margin: 12px 0 4px 0; font-size: 22px; color: #ffffff;">Thank You for Your Order!</h2>
      <p style="margin: 0; font-size: 13px; color: #888888;">Order ID: <span class="cyan">#${shortId}</span></p>
    </div>

    <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 16px; margin-bottom: 20px;">
      <p style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #888888;">Delivery Details</p>
      <p style="margin: 0; font-size: 13px; color: #ffffff;"><strong>${shipping.name || user?.name || "Valued Customer"}</strong></p>
      <p style="margin: 3px 0 0 0; font-size: 12px; color: #aaaaaa;">${deliveryAddress || "Address provided at checkout"}</p>
      ${shipping.phone ? `<p style="margin: 3px 0 0 0; font-size: 12px; color: #aaaaaa;">Phone: ${shipping.phone}</p>` : ""}
      <p style="margin: 6px 0 0 0; font-size: 12px; color: #00E5FF;">Payment: ${paymentMethodText}</p>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
      <thead>
        <tr>
          <th style="text-align: left; font-size: 11px; text-transform: uppercase; color: #777777; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1);">Item</th>
          <th style="text-align: right; font-size: 11px; text-transform: uppercase; color: #777777; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1);">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #aaaaaa; margin-top: 10px;">
      <tr>
        <td style="padding: 4px 0;">Subtotal:</td>
        <td style="padding: 4px 0; text-align: right; color: #ffffff;">$${subtotal}</td>
      </tr>
      <tr>
        <td style="padding: 4px 0;">Shipping:</td>
        <td style="padding: 4px 0; text-align: right; color: #ffffff;">${shippingText}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0 0 0; font-size: 16px; font-weight: bold; color: #ffffff; border-top: 1px solid rgba(255,255,255,0.15);">Total:</td>
        <td style="padding: 10px 0 0 0; text-align: right; font-size: 18px; font-weight: bold; color: #00E5FF; border-top: 1px solid rgba(255,255,255,0.15);">$${total}</td>
      </tr>
    </table>

    <div class="footer">
      Thank you for shopping with NexaTech · Track your order in My Orders.
    </div>
  </div>
</body>
</html>
    `;

    await sendEmail({
      to: customerEmail,
      subject: `NexaTech Order Confirmed — #${shortId}`,
      html,
    });
  } catch (err) {
    console.error("[orderEmail] Error sending order confirmation email:", err.message);
  }
};

module.exports = {
  sendOrderConfirmationEmail,
};
