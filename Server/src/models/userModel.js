// User model - SQL queries for user table
import { query } from '../database/index.js';

export const createUser = async (userData) => {
  // 1. Insert into users table (Base info)
  const insertUserQuery = `
    INSERT INTO users (
      id, full_name, email, phone, joined_date, status
    ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, 'Active')
    RETURNING *
  `;

  const userValues = [
    userData.id,
    userData.name,
    userData.email,
    userData.phone
  ];

  const userResult = await query(insertUserQuery, userValues);
  const user = userResult.rows[0];

  // 2. Insert into user_profiles table (Extended info)
  const insertProfileQuery = `
    INSERT INTO user_profiles (
      user_id, password, city, user_type, is_employee,
      organization, identity_id, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;

  const profileValues = [
    userData.id,
    userData.password,
    userData.city || null,
    userData.userType,
    userData.isEmployee,
    userData.organization || null,
    userData.identityId || null,
    userData.createdBy
  ];

  await query(insertProfileQuery, profileValues);

  return user;
};

export const findUserByEmail = async (email) => {
  // Join users and user_profiles to get complete data
  const sql = `
    SELECT u.*, p.password, p.user_type, p.is_employee 
    FROM users u
    LEFT JOIN user_profiles p ON u.id = p.user_id
    WHERE u.email = $1
  `;
  const result = await query(sql, [email]);
  return result.rows[0];
};

export const findUserByIdentifier = async (identifier) => {
  const sql = `
    SELECT u.*, p.password, p.user_type, p.is_employee 
    FROM users u
    LEFT JOIN user_profiles p ON u.id = p.user_id
    WHERE u.email = $1 OR u.phone = $2
  `;
  const result = await query(sql, [identifier, identifier]);
  return result.rows[0];
};

export const findUserById = async (userId) => {
  const sql = `
    SELECT u.*, p.* 
    FROM users u
    LEFT JOIN user_profiles p ON u.id = p.user_id
    WHERE u.id = $1
  `;
  const result = await query(sql, [userId]);
  return result.rows[0];
};

export const updateUser = async (userId, userData) => {
  // Update base info
  const updateUserQuery = `
    UPDATE users 
    SET 
      full_name = $1,
      phone = $2
    WHERE id = $3
    RETURNING *
  `;

  await query(updateUserQuery, [
    userData.name?.toLowerCase(),
    userData.phone,
    userId
  ]);

  // Update profile info
  const updateProfileQuery = `
    UPDATE user_profiles
    SET 
      city = $1,
      organization = $2,
      identity_id = $3,
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $4
    RETURNING *
  `;

  const values = [
    userData.city?.toLowerCase(),
    userData.organization?.toLowerCase() || null,
    userData.identityId?.toLowerCase() || null,
    userId
  ];

  const result = await query(updateProfileQuery, values);

  // Return combined data (simplified for now)
  return { id: userId, ...userData };
};
