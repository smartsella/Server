import crypto from "crypto";
import bcrypt from "bcrypt";
import partnerModel from "../models/partnerModel.js";
import { sendOtpEmail } from "../utils/emailService.js";

async function sendOtp(identifier) {
  const partner = await partnerModel.findByIdentifier(identifier);
  if (!partner) throw new Error("User not found");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await partnerModel.saveOtp(identifier, otpHash, expiry);

  // Send OTP via email
  if (partner.email) {
      await sendOtpEmail(partner.email, otp);
  } else {
      // Fallback for phone-only users (if applicable in future)
      console.log(`Need SMS integration for ${identifier}`);
  }

  console.log(`🔐 OTP for ${identifier}: ${otp}`);

  return true;
}

async function verifyOtp(identifier, otp) {
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  const partner = await partnerModel.verifyOtp(identifier, otpHash);
  if (!partner) throw new Error("Invalid or expired OTP");

  return partner;
}

async function resetPassword(identifier, otp, newPassword) {
  const partner = await verifyOtp(identifier, otp);

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await partnerModel.resetPassword(partner.id, hashedPassword);

  return true;
}

export const partnerOtpService = {
  sendOtp,
  verifyOtp,
  resetPassword,
};
