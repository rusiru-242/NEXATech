const nodemailer = require("nodemailer");

let transporter = null;
let emailEnabled = false;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Verify transporter in background; if verification fails we fallback to dev logging
  transporter.verify().then(() => {
    emailEnabled = true;
    console.info("Email transporter verified");
  }).catch((err) => {
    emailEnabled = false;
    console.warn("Email transporter verification failed, falling back to dev logging:", err.message);
  });
} else {
  console.info("EMAIL_USER or EMAIL_PASS not set — using dev email fallback (logs only)");
}

/**
 * Send email. In production when credentials are available the message will be sent.
 * Otherwise the OTP/message will be logged to the server console (dev fallback).
 * Returns an object describing whether it was sent or logged.
 */
const sendEmail = async ({ to, subject, html }) => {
  // Dev fallback when transporter isn't configured or verification failed
  if (!emailEnabled || !transporter) {
    console.info(`\n=== DEV EMAIL FALLBACK ===\nTo: ${to}\nSubject: ${subject}\n${html}\n========================\n`);
    return { sent: false, devFallback: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"NexaTech" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    return { sent: true, devFallback: false, info };
  } catch (err) {
    console.error("sendEmail error — falling back to dev log:", err.message);
    console.info(`\n=== EMAIL FAILED, LOGGING MESSAGE ===\nTo: ${to}\nSubject: ${subject}\n${html}\n====================================\n`);
    return { sent: false, devFallback: true, error: err.message };
  }
};

module.exports = sendEmail;