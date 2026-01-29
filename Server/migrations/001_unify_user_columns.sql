-- Migration to setup/unify user tables

-- 1. Create 'users' table if not exists
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  full_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'Active'
);

-- 2. Create 'user_profiles' table if not exists (with NEW schema)
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  password VARCHAR(255),
  city VARCHAR(255),
  user_type VARCHAR(50),
  is_employee BOOLEAN DEFAULT FALSE,
  organization VARCHAR(255),
  identity_id VARCHAR(100),
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  start_date TIMESTAMP,
  PRIMARY KEY (user_id)
);

-- 3. Alter commands for existing tables (if they were created with old schema)
-- These might fail if table is new, which is fine (handled by runner)

-- Add new columns if missing
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS organization VARCHAR(255);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS identity_id VARCHAR(100);

-- Migrate data (if columns existed before and we just added new ones)
-- Note: If table was just created, this does nothing.
UPDATE user_profiles 
SET organization = university, identity_id = student_id 
WHERE (organization IS NULL) AND (user_type = 'student' OR user_type = 'Student') AND (university IS NOT NULL);

UPDATE user_profiles 
SET organization = company_name, identity_id = employee_id 
WHERE (organization IS NULL) AND (user_type = 'professional' OR user_type = 'Professional') AND (company_name IS NOT NULL);

-- Drop old columns (if they exist)
ALTER TABLE user_profiles DROP COLUMN IF EXISTS university;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS student_id;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS company_name;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS employee_id;
