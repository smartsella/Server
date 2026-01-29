// Auth controller - Handles authentication requests and responses
import { registerUser, loginUser, googleAuth, sendOtpService, verifyOtpService, resetPasswordService, getUserProfile as getUserProfileService, updateUserProfile as updateUserProfileService } from '../services/authService.js';

export const signup = async (req, res) => {
  console.log('\n========== SIGNUP DATA RECEIVED ==========');
  console.log('User Type:', req.body.userType);
  console.log('Form Data:', JSON.stringify(req.body, null, 2));
  console.log('==========================================\n');
  
  try {
    const user = await registerUser(req.body);
    
    res.json({ 
      success: true, 
      message: 'User registered successfully!',
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email_address,
        userType: user.user_type
      }
    });
  } catch (error) {
    console.error('❌ Error saving user to database:', error);
    
    if (error.code === 'USER_EXISTS') {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }
    
    if (error.code === '23505') {
      // Check which constraint was violated
      if (error.constraint === 'users_email_address_key') {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already registered' 
        });
      }
      if (error.constraint === 'users_phone_number_key') {
        return res.status(400).json({ 
          success: false, 
          message: 'Phone number already registered' 
        });
      }
      return res.status(400).json({ 
        success: false, 
        message: 'This user already exists' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error registering user',
      error: error.message 
    });
  }
};

export const login = async (req, res) => {
  console.log('\n========== LOGIN ATTEMPT ==========');
  console.log('Identifier:', req.body.identifier);
  console.log('===================================\n');
  
  try {
    const user = await loginUser(req.body);
    
    res.json({ 
      success: true, 
      message: 'Login successful!',
      user
    });
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    
    if (error.code === 'USER_NOT_FOUND') {
      return res.status(404).json({ 
        success: false, 
        message: 'User does not exist' 
      });
    }
    
    if (error.code === 'INVALID_PASSWORD') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid password' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error during login',
      error: error.message 
    });
  }
};

export const googleAuthentication = async (req, res) => {
  console.log('\n========== GOOGLE AUTH ATTEMPT ==========');
  console.log('Name:', req.body.name);
  console.log('Email:', req.body.email);
  console.log('=========================================\n');
    console.log('idToken present:', !!req.body.idToken);
    console.log('accessToken present:', !!req.body.accessToken);
    console.log('Payload preview:', JSON.stringify(req.body && { idToken: !!req.body.idToken, accessToken: !!req.body.accessToken }, null, 2));
  
  try {
    const user = await googleAuth(req.body);
    
    res.json({ 
      success: true, 
      message: 'Google authentication successful!',
      user
    });
  } catch (error) {
    console.error('❌ Google auth failed:', error);
    
    // Check for duplicate phone number (if Google user creation fails)
    if (error.code === '23505' && error.constraint === 'users_phone_number_key') {
      // Retry with a different placeholder phone
      try {
        req.body.retryPhone = true;
        const user = await googleAuth(req.body);
        return res.json({ 
          success: true, 
          message: 'Google authentication successful!',
          user
        });
      } catch (retryError) {
        return res.status(500).json({ 
          success: false, 
          message: 'Error during Google authentication' 
        });
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error during Google authentication',
      error: error.message 
    });
  }
};

export const forgotPassword = async (req, res) => {
  console.log('\n========== FORGOT PASSWORD REQUEST ==========');
  console.log('Identifier:', req.body.identifier);
  console.log('User Type:', req.body.userType);
  console.log('============================================\n');
  
  try {
    const { identifier, userType } = req.body;
    
    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number is required'
      });
    }
    
    const result = await sendOtpService(identifier, userType);
    
    res.json({
      success: true,
      message: 'OTP sent successfully',
      data: result
    });
  } catch (error) {
    console.error('❌ Forgot password failed:', error.message);
    
    if (error.code === 'USER_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email/phone'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error sending OTP',
      error: error.message
    });
  }
};

export const verifyOtp = async (req, res) => {
  console.log('\n========== VERIFY OTP REQUEST ==========');
  console.log('Identifier:', req.body.identifier);
  console.log('OTP:', req.body.otp);
  console.log('========================================\n');
  
  try {
    const { identifier, otp, userType } = req.body;
    
    if (!identifier || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email/phone and OTP are required'
      });
    }
    
    const result = await verifyOtpService(identifier, otp, userType);
    
    res.json({
      success: true,
      message: 'OTP verified successfully',
      resetToken: result.resetToken
    });
  } catch (error) {
    console.error('❌ OTP verification failed:', error.message);
    
    if (error.code === 'INVALID_OTP') {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message
    });
  }
};

export const resetPassword = async (req, res) => {
  console.log('\n========== RESET PASSWORD REQUEST ==========');
  console.log('Reset Token:', req.body.resetToken ? 'Present' : 'Missing');
  console.log('===========================================\n');
  
  try {
    const { resetToken, newPassword, userType } = req.body;
    
    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required'
      });
    }
    
    await resetPasswordService(resetToken, newPassword, userType);
    
    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('❌ Password reset failed:', error.message);
    
    if (error.code === 'INVALID_TOKEN') {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await getUserProfileService(userId);
    
    res.json({ 
      success: true,
      user
    });
  } catch (error) {
    console.error('❌ Error fetching user profile:', error.message);
    
    if (error.code === 'USER_NOT_FOUND') {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching user profile',
      error: error.message 
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updateData = req.body;
    
    const updatedUser = await updateUserProfileService(userId, updateData);
    
    res.json({ 
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('❌ Error updating user profile:', error.message);
    
    if (error.code === 'USER_NOT_FOUND') {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error updating user profile',
      error: error.message 
    });
  }
};
