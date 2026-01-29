// Auth service - Business logic for authentication

import { createUser, findUserByEmail, findUserById, updateUser } from '../models/userModel.js';
import partnerModel from '../models/partnerModel.js';
import { generateUserId } from '../utils/idGenerator.js';
import { sendOtpEmail, sendOtpSms } from '../utils/emailService.js';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerUser = async (signupData) => {
  const { userType, name, email, password, phone, address, studentId, university, company, employeeId } = signupData;

  // Convert email to lowercase for consistency
  const emailLower = email?.toLowerCase();

  // Check if user already exists
  const existingUser = await findUserByEmail(emailLower);
  if (existingUser) {
    throw { code: 'USER_EXISTS', message: 'Email already registered' };
  }

  // Determine if user is an employee
  const isEmployee = userType === 'Professional';

  // Convert userType to lowercase for enum
  const userTypeEnum = userType.toLowerCase();

  // Generate user ID
  const userId = generateUserId(name);

  // Prepare user data with lowercase strings and generic columns
  const userData = {
    id: userId,
    name: name?.toLowerCase(),
    email: emailLower,
    password, // Not encrypted as per user request
    phone,
    city: address?.toLowerCase(),
    userType: userTypeEnum,
    isEmployee,
    // Map specific fields to generic DB columns
    organization: isEmployee ? company?.toLowerCase() : university?.toLowerCase(),
    identityId: isEmployee ? employeeId?.toLowerCase() : studentId?.toLowerCase(),
    createdBy: 'self-registration'
  };

  // Create user
  const user = await createUser(userData);

  // Log to console (Using base user fields)
  console.log('\n🎉 USER SAVED TO DATABASE:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('ID:', user.id);
  console.log('Name:', user.full_name);
  console.log('Email:', user.email);
  console.log('Phone:', user.phone);
  console.log('City:', userData.city); // From input, as not in base user return
  console.log('User Type:', userData.userType);

  // Convert UTC to IST for display
  const istTime = new Date(user.joined_date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  console.log('Joined Date (IST):', istTime);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  return user;
};

export const loginUser = async (loginData) => {
  const { identifier, password } = loginData;

  // Convert identifier to lowercase for case-insensitive search
  const identifierLower = identifier?.toLowerCase();

  // Find user by email or phone
  const { findUserByIdentifier } = await import('../models/userModel.js');
  const user = await findUserByIdentifier(identifierLower);

  if (!user) {
    throw { code: 'USER_NOT_FOUND', message: 'User does not exist' };
  }

  // Check password (not encrypted as per user request)
  if (user.password !== password) {
    throw { code: 'INVALID_PASSWORD', message: 'Invalid password' };
  }

  // Log successful login
  console.log('\n✅ USER LOGGED IN:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('ID:', user.id);
  console.log('Name:', user.full_name);
  console.log('Email:', user.email);
  console.log('User Type:', user.user_type);
  const istTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  console.log('Login Time (IST):', istTime);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  return {
    id: user.id,
    name: user.full_name,
    email: user.email,
    userType: user.user_type,
    isEmployee: user.is_employee
  };
};

export const googleAuth = async (googleData) => {
  const { idToken, accessToken, retryPhone } = googleData;

  let name, email, picture;

  if (idToken) {
    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    name = payload?.name;
    email = payload?.email;
    picture = payload?.picture;
  } else if (accessToken) {
    // Fallback: use access token to fetch userinfo
    const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!resp.ok) throw new Error('Failed to fetch Google userinfo');
    const payload = await resp.json();
    name = payload?.name;
    email = payload?.email;
    picture = payload?.picture;
  } else {
    throw new Error('Missing Google ID token or access token');
  }
  const emailLower = email?.toLowerCase();

  // Check if user already exists
  const existingUser = await findUserByEmail(emailLower);
  if (existingUser) {
    // User exists, log them in
    return {
      id: existingUser.id,
      name: existingUser.full_name,
      email: existingUser.email,
      userType: existingUser.user_type,
      isEmployee: existingUser.is_employee,
      picture: picture
    };
  } else {
    // User doesn't exist, create new user with Google info
    const userId = generateUserId(name);
    const phoneNumber = retryPhone ? `9999${Date.now().toString().slice(-6)}` : `9999999${userId.slice(-3)}`;
    const userData = {
      id: userId,
      name: name?.toLowerCase(),
      email: emailLower,
      password: `google_auth_${Date.now()}`,
      phone: phoneNumber,
      city: null,
      userType: 'student',
      isEmployee: false,
      organization: null,
      identityId: null,
      createdBy: 'google-authentication'
    };
    const newUser = await createUser(userData);
    return {
      id: newUser.id,
      name: newUser.full_name,
      email: newUser.email,
      userType: newUser.user_type,
      isEmployee: newUser.is_employee,
      picture: picture
    };
  }
};

const otpStore = new Map();

export const sendOtpService = async (identifier, userType = 'user') => {
  // 1. Validate identifier
  if (!identifier) {
    throw { code: 'INVALID_INPUT', message: 'Email or phone number is required' };
  }

  // 2. Check if user exists
  const isEmail = identifier.includes('@');
  // Dynamic import to avoid circular dependency issues if any, though model import is safe
  const { query } = await import('../database/index.js');

  if (userType === 'partner') {
    // Check partner existence
    const partnerSql = isEmail
      ? 'SELECT id FROM partner_accounts WHERE LOWER(email) = $1'
      : 'SELECT id FROM partner_accounts WHERE phone_number = $1';

    // Check fallback legacy tables if needed, for simplicity checking main partner table
    const result = await query(partnerSql, [identifier.toLowerCase()]);
    if (result.rowCount === 0) {
      // Try verifying against service tables directly as fallback
      const accSql = isEmail
        ? 'SELECT id FROM accommodation_services WHERE LOWER(email_id) = $1'
        : 'SELECT id FROM accommodation_services WHERE phone_number = $1';
      const accResult = await query(accSql, [identifier.toLowerCase()]);
      if (accResult.rowCount === 0) throw { code: 'USER_NOT_FOUND', message: 'Partner not found' };
    }
  } else {
    // Check user existence
    const user = await findUserByEmail(identifier.toLowerCase());
    // Note: findUserByEmail only checks email. if phone is passed, we might need findUserByIdentifier
    if (!user) {
      // Double check with identifier lookup if it wasn't an email or findUserByEmail is strict
      const { findUserByIdentifier } = await import('../models/userModel.js');
      const userByPhone = await findUserByIdentifier(identifier);
      if (!userByPhone) throw { code: 'USER_NOT_FOUND', message: 'User not found' };
    }
  }

  // 3. Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // 4. Store OTP (expires in 10 mins)
  otpStore.set(identifier, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000,
    userType
  });

  // 5. Send OTP
  if (isEmail) {
    await sendOtpEmail(identifier, otp);
  } else {
    await sendOtpSms(identifier, otp);
  }

  console.log(`\n🔑 OTP SENT to ${identifier}: ${otp} (${userType})`);
  return { success: true, message: 'OTP sent successfully' };
};

export const verifyOtpService = async (identifier, otp, userType) => {
  // 1. Get stored OTP data
  const storedData = otpStore.get(identifier);

  // 2. Validate
  if (!storedData) {
    throw { code: 'INVALID_OTP', message: 'OTP not found or expired' };
  }

  if (storedData.otp !== otp) {
    throw { code: 'INVALID_OTP', message: 'Invalid OTP' };
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(identifier);
    throw { code: 'INVALID_OTP', message: 'OTP expired' };
  }

  // 3. Generate Reset Token (valid for 15 mins)
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Store reset token mapping back to identifier
  // We reuse otpStore for simplicity, or we could use different store. 
  // Key: resetToken, Value: { identifier, userType, expiresAt }
  otpStore.set(resetToken, {
    identifier,
    userType: storedData.userType, // Use stored type to be safe
    expiresAt: Date.now() + 15 * 60 * 1000
  });

  // Clear used OTP
  otpStore.delete(identifier);

  console.log(`\n✅ OTP VERIFIED for ${identifier}. Reset Token generated.`);
  return { success: true, resetToken };
};

export const resetPasswordService = async (resetToken, newPassword, userType = 'user') => {
  // Get reset token data
  const resetData = otpStore.get(resetToken);

  if (!resetData) {
    throw { code: 'INVALID_TOKEN', message: 'Invalid or expired reset token' };
  }

  // Check expiry
  if (Date.now() > resetData.expiresAt) {
    otpStore.delete(resetToken);
    throw { code: 'INVALID_TOKEN', message: 'Reset token has expired' };
  }

  const { identifier, userType: tokenUserType } = resetData;

  // Update password in database
  const { query } = await import('../database/index.js');

  if (tokenUserType === 'partner') {
    // Update partner_accounts table
    const isEmail = identifier.includes('@');

    // First try partner_accounts
    const sql = isEmail
      ? 'UPDATE partner_accounts SET password_hash = $1 WHERE LOWER(email) = $2 RETURNING *'
      : 'UPDATE partner_accounts SET password_hash = $1 WHERE phone_number = $2 RETURNING *';

    let result = await query(sql, [newPassword, identifier]);
    // ... existing partner handling ...
    if (result.rowCount > 0) {
      // ... existing sync logic ...
      const { reference_table, reference_row_id } = result.rows[0];
      if (reference_table === 'accommodation_services' && reference_row_id) {
        await query('UPDATE accommodation_services SET password=$1 WHERE id=$2', [newPassword, reference_row_id]);
      } else if (reference_table === 'services' && reference_row_id) {
        await query('UPDATE services SET password=$1 WHERE id=$2', [newPassword, reference_row_id]);
      }
    } else {
      // ... fallback ...
      const accSql = isEmail
        ? 'UPDATE accommodation_services SET password = $1 WHERE LOWER(email_id) = $2 RETURNING *'
        : 'UPDATE accommodation_services SET password = $1 WHERE phone_number = $2 RETURNING *';
      result = await query(accSql, [newPassword, identifier]);
      if (result.rowCount === 0) throw { code: 'USER_NOT_FOUND', message: 'Partner not found' };
    }
  } else {
    // Update users table (VIA user_profiles now)
    // We need to find the user_id first using the email/phone in users table
    const isEmail = identifier.includes('@');
    const findUserSql = isEmail
      ? 'SELECT id FROM users WHERE LOWER(email) = $1'
      : 'SELECT id FROM users WHERE phone = $1';

    const userResult = await query(findUserSql, [identifier]);

    if (userResult.rowCount === 0) {
      throw { code: 'USER_NOT_FOUND', message: 'User not found' };
    }

    const userId = userResult.rows[0].id;

    // Now update password in user_profiles
    const updateSql = 'UPDATE user_profiles SET password = $1 WHERE user_id = $2 RETURNING *';
    await query(updateSql, [newPassword, userId]);
  }

  // Remove reset token after successful password reset
  otpStore.delete(resetToken);

  console.log('\n✅ PASSWORD RESET SUCCESSFUL:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Identifier:', identifier);
  console.log('User Type:', tokenUserType);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  return { success: true };
};

export const getUserProfile = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw { code: 'USER_NOT_FOUND', message: 'User not found' };
  }

  // Format created_at date
  const joinDate = user.joined_date
    ? new Date(user.joined_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    : 'Not available';

  return {
    id: user.id,
    name: user.full_name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    userType: user.user_type,
    isEmployee: user.is_employee,
    // Map generic columns back to specific fields for frontend compatibility
    studentId: !user.is_employee ? user.identity_id : null,
    university: !user.is_employee ? user.organization : null,
    company: user.is_employee ? user.organization : null,
    employeeId: user.is_employee ? user.identity_id : null,
    joinDate: joinDate,
    accountStatus: user.status || 'Active',
    ecosystemScore: 0,
    totalSavings: 0,
    activeServices: 0,
    savedItems: 0
  };
};

export const updateUserProfile = async (userId, updateData) => {
  const user = await findUserById(userId);

  if (!user) {
    throw { code: 'USER_NOT_FOUND', message: 'User not found' };
  }

  // Map specific update fields to generic DB columns
  const mappedUpdateData = {
    ...updateData,
    organization: updateData.company || updateData.university,
    identityId: updateData.employeeId || updateData.studentId
  };

  const updatedUser = await updateUser(userId, mappedUpdateData);

  // Refetch complete data to return
  const freshUser = await findUserById(userId);

  console.log('\n✅ USER PROFILE UPDATED:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('ID:', freshUser.id);
  console.log('Name:', freshUser.full_name);
  console.log('Phone:', freshUser.phone);
  console.log('City:', freshUser.city);
  const istTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  console.log('Updated At (IST):', istTime);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  return {
    id: freshUser.id,
    name: freshUser.full_name,
    email: freshUser.email,
    phone: freshUser.phone,
    city: freshUser.city,
    userType: freshUser.user_type,
    isEmployee: freshUser.is_employee,
    studentId: !freshUser.is_employee ? freshUser.identity_id : null,
    university: !freshUser.is_employee ? freshUser.organization : null,
    company: freshUser.is_employee ? freshUser.organization : null,
    employeeId: freshUser.is_employee ? freshUser.identity_id : null
  };
};
