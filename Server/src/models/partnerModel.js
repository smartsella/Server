// models/partnerModel.js
import { query } from "../database/index.js";

// find partner by email or phone
const findByIdentifier = async (identifier) => {
  const { rows } = await query(
    `SELECT *
     FROM partner_accounts
     WHERE LOWER(email) = LOWER($1) OR phone_number = $1
     LIMIT 1`,
    [identifier]
  );
  return rows[0];
};

// store OTP
const saveOtp = async (identifier, otpHash, expiry) => {
  return query(
    `UPDATE partner_accounts
     SET otp = $1, otp_expiry = $2
     WHERE LOWER(email) = LOWER($3) OR phone_number = $3`,
    [otpHash, expiry, identifier]
  );
};

// verify OTP
const verifyOtp = async (identifier, otpHash) => {
  const { rows } = await query(
    `SELECT *
     FROM partner_accounts
     WHERE (LOWER(email)=LOWER($1) OR phone_number=$1)
       AND otp=$2
       AND otp_expiry > NOW()
     LIMIT 1`,
    [identifier, otpHash]
  );
  return rows[0];
};

// reset password
const resetPassword = async (partnerId, hashedPassword) => {
  const result = await query(
    `UPDATE partner_accounts
     SET password_hash=$1, otp=NULL, otp_expiry=NULL
     WHERE id=$2
     RETURNING reference_table, reference_row_id`,
    [hashedPassword, partnerId]
  );

  if (result.rows.length > 0) {
    const { reference_table, reference_row_id } = result.rows[0];

    // Sync password to legacy tables
    if (reference_table === 'accommodation_services' && reference_row_id) {
       await query(
           `UPDATE accommodation_services SET password=$1 WHERE id=$2`,
           [hashedPassword, reference_row_id]
       );
    } else if (reference_table === 'services' && reference_row_id) {
       await query(
           `UPDATE services SET password=$1 WHERE id=$2`,
           [hashedPassword, reference_row_id]
       );
    }
  }

  return result;
};

export default {
  findByIdentifier,
  saveOtp,
  verifyOtp,
  resetPassword,
};
