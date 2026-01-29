import nodemailer from "nodemailer";

/**
 * Create and verify email transporter
 */
const createTransporter = () => {
  // Hard fail early if env is broken
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      "EMAIL_USER or EMAIL_PASS missing in environment variables"
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // Gmail App Password ONLY
    }
  });

  return transporter;
};

/**
 * Send OTP via Email
 */
export const sendOtpEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Jeevigo" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP - Jeevigo",
      html: `
        <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>OTP Verification</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f2f4f8;
        font-family: Arial, Helvetica, sans-serif;
      }

      .wrapper {
        width: 100%;
        padding: 30px 0;
      }

      .container {
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      .header {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: #ffffff;
        text-align: center;
        padding: 30px 20px;
      }

      .header h1 {
        margin: 0;
        font-size: 26px;
      }

      .content {
        padding: 30px 25px;
        color: #333333;
        line-height: 1.6;
      }

      .content p {
        margin: 0 0 16px;
        font-size: 15px;
      }

      .otp-box {
        background: #f7f8ff;
        border: 2px dashed #667eea;
        text-align: center;
        padding: 20px;
        margin: 25px 0;
        border-radius: 6px;
      }

      .otp {
        font-size: 34px;
        font-weight: bold;
        letter-spacing: 6px;
        color: #667eea;
      }

      .expiry {
        font-size: 14px;
        color: #555;
        margin-top: 10px;
      }

      .warning {
        background: #fff3f3;
        border-left: 4px solid #e74c3c;
        padding: 12px 15px;
        font-size: 14px;
        color: #c0392b;
        margin-top: 20px;
      }

      .support {
        margin-top: 25px;
        font-size: 14px;
        color: #555;
      }

      .footer {
        background: #f7f7f7;
        text-align: center;
        padding: 15px;
        font-size: 12px;
        color: #777;
      }
    </style>
  </head>

  <body>
    <div class="wrapper">
      <div class="container">
        <div class="header">
          <h1>OTP Verification</h1>
        </div>

        <div class="content">
          <p>Hello,</p>

          <p>
            We received a request to reset your password.  
            Please use the One-Time Password (OTP) below to continue.
          </p>

          <div class="otp-box">
            <div class="otp">${otp}</div>
            <div class="expiry">This OTP is valid for 10 minutes</div>
          </div>

          <p>
            If you did not request a password reset, please ignore this email.
            Your account will remain secure.
          </p>

          <div class="warning">
            ⚠️ Do not share this OTP with anyone.  
            Our team will never ask for your OTP.
          </div>

          <div class="support">
            Need help? Contact our support team at  
            <strong>support@jeevigo.com</strong>
          </div>
        </div>

        <div class="footer">
          © 2026 Jeevigo. All rights reserved.<br />
          This is an automated message. Please do not reply.
        </div>
      </div>
    </div>
  </body>
</html>

      `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ OTP email sent:", info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};

/**
 * SMS placeholder
 */
export const sendOtpSms = async (phoneNumber, otp) => {
  console.log("📱 SMS not configured");
  console.log(`OTP ${otp} would be sent to ${phoneNumber}`);

  return { success: true, note: "SMS service not configured" };
};
