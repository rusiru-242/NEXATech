const nodemailer = require("nodemailer");

let transporter = null;

/**
 * Get or initialize Nodemailer transporter.
 */
const getTransporter = () => {
  if (transporter) return transporter;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 465,
    secure:
      process.env.EMAIL_SECURE === "true" ||
      Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return transporter;
};

/**
 * Send email using Nodemailer with dev fallback.
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const mailTransporter = getTransporter();

  if (!mailTransporter) {
    console.info(
      `\n=== DEV EMAIL FALLBACK (NO CREDENTIALS) ===\nTo: ${to}\nSubject: ${subject}\n${html}\n==========================================\n`
    );
    return { sent: false, devFallback: true };
  }

  try {
    const from =
      process.env.EMAIL_FROM ||
      `"NexaTech" <${process.env.EMAIL_USER}>`;

    const info = await mailTransporter.sendMail({
      from,
      to,
      subject,
      text: text || undefined,
      html,
    });

    console.info(`[sendEmail] Email sent to ${to} (${info.messageId})`);
    return { sent: true, devFallback: false, info };
  } catch (err) {
    console.error(`[sendEmail] Failed to send email to ${to}:`, err.message);
    console.info(
      `\n=== EMAIL FAILED, LOGGED IN DEV ===\nTo: ${to}\nSubject: ${subject}\nError: ${err.message}\n${html}\n===================================\n`
    );
    return { sent: false, devFallback: true, error: err.message };
  }
};

module.exports = sendEmail;