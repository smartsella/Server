import { partnerService } from "../services/partnerService.js";
import { partnerOtpService } from "../services/partnerfogeServices.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const partnerController = {
  /**
   * SEND OTP (Forgot Password)
   */
  async sendOtp(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      await partnerOtpService.sendOtp(email.toLowerCase());

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  /**
   * VERIFY OTP
   */
  async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: "Email and OTP are required",
        });
      }

      // Verify OTP using service (handles finding user and checking hash)
      await partnerOtpService.verifyOtp(email.toLowerCase(), otp);

      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      });
    } catch (error) {
      console.error("Verify OTP Error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Invalid or expired OTP",
      });
    }
  },

  /**
   * RESET PASSWORD
   */
  async resetPassword(req, res) {
    try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Email, OTP, and new password are required",
        });
      }

      await partnerOtpService.resetPassword(email.toLowerCase(), otp, newPassword);

      return res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      console.error("Reset Password Error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to reset password",
      });
    }
  },


  /**
   * LOGIN PARTNER
   */
  async login(req, res) {
    try {
      const { email, password, phone, identifier: reqIdentifier } = req.body;
      const identifier = reqIdentifier || email || phone;

      if (!identifier || !password) {
        return res.status(400).json({
          success: false,
          message: "Email/Phone and password are required",
        });
      }

      const result = await partnerService.loginPartner(identifier, password);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Login Error:", error);
      return res.status(401).json({
        success: false,
        message: error.message || "Invalid credentials",
      });
    }
  },

  /**
   * SIGNUP PARTNER
   */
  async signup(req, res) {
    try {
      const { partnerType } = req.body;

      let result;
      
      if (req.body.serviceCategory && !req.body.roomsAvailable) {
           result = await partnerService.registerService(req.body);
      } else {
           result = await partnerService.registerAccommodation(req.body);
      }
      
      return res.status(201).json(result);
    } catch (error) {
      console.error("Signup Error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Signup failed",
      });
    }
  },

  /**
   * GET PARTNER PROPERTIES
   */
  async getProperties(req, res) {
    try {
      const { email } = req.query;
      
      if (!email) {
         return res.status(400).json({
            success: false,
             message: "Email is required to fetch properties"
         });
      }

      const result = await partnerService.getPartnerAccommodations(email);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Get Properties Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch properties",
      });
    }
  },

  /**
   * GET ALL ACCOMMODATIONS (Public)
   */
  async getAllAccommodations(req, res) {
    try {
      const result = await partnerService.getAllAccommodations();
      return res.status(200).json(result);
    } catch (error) {
      console.error("Get All Accommodations Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch accommodations",
      });
    }
  },

  /**
   * GET PARTNER STORES
   */
  async getStores(req, res) {
    try {
      const { email } = req.query;
      
      if (!email) {
         return res.status(400).json({
            success: false,
             message: "Email is required to fetch store data"
         });
      }

      const result = await partnerService.getPartnerStores(email);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Get Stores Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch store data",
      });
    }
  },

  /**
   * UPDATE PARTNER ACCOMMODATION
   */
  async updateAccommodation(req, res) {
    try {
      const { email } = req.query;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required to update accommodation"
        });
      }

      const result = await partnerService.updatePartnerAccommodation(email, req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Update Accommodation Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update accommodation",
      });
    }
  },

  /**
   * UPDATE PARTNER SERVICE
   */
  async updateService(req, res) {
    try {
      const { email } = req.query;
      
      console.log('📝 Update Service Request:');
      console.log('  Email:', email);
      console.log('  Body:', JSON.stringify(req.body, null, 2));
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required to update service"
        });
      }

      const result = await partnerService.updatePartnerService(email, req.body);
      console.log('✅ Update Service Success:', result);
      return res.status(200).json(result);
    } catch (error) {
      console.error("❌ Update Service Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update service",
      });
    }
  },

  /**
   * UPLOAD PROPERTY IMAGE
   */
  async uploadPropertyImage(req, res) {
    try {
      const { email, photoType, serviceType, oldPublicId } = req.body;
      
      // Validate required fields
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required"
        });
      }

      if (!photoType || !['room', 'bathroom', 'exterior'].includes(photoType)) {
        return res.status(400).json({
          success: false,
          message: "Valid photo type is required (room, bathroom, or exterior)"
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image file provided"
        });
      }

      // Delete old photo from Cloudinary if exists
      if (oldPublicId) {
        try {
          const deleteResult = await deleteFromCloudinary(oldPublicId);
          console.log('Old photo deleted from Cloudinary:', oldPublicId);
        } catch (deleteError) {
          console.error('Error deleting old photo:', deleteError);
          // Continue with upload even if delete fails
        }
      }

      // Fetch partner details to get the ID
      const partnerAccommodations = await partnerService.getPartnerAccommodations(email);
      
      if (!partnerAccommodations.data || partnerAccommodations.data.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Partner not found"
        });
      }

      const partnerId = partnerAccommodations.data[0].id;
      
      // Determine service type prefix (default to PG if not provided)
      const servicePrefix = (serviceType || 'PG').toUpperCase();
      
      // Capitalize first letter of photoType (room -> Room, bathroom -> Bathroom, exterior -> Exterior)
      const capitalizedPhotoType = photoType.charAt(0).toUpperCase() + photoType.slice(1);
      
      // Create filename: PGRoom{partnerId}, PGBathroom{partnerId}, PGExterior{partnerId}
      const fileExtension = path.extname(req.file.originalname);
      const fileName = `${servicePrefix}${capitalizedPhotoType}${partnerId}${fileExtension}`;

      // Create a temporary file to upload to Cloudinary
      const tempDir = os.tmpdir();
      const tempFilePath = path.join(tempDir, fileName);

      // Write buffer to temporary file
      fs.writeFileSync(tempFilePath, req.file.buffer);

      try {
        // Upload to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(tempFilePath, `mylifeeasy/properties/${photoType}`);

        // Delete temporary file after upload
        fs.unlinkSync(tempFilePath);

        // Clean up old uploads/properties folder if it exists
        const oldUploadsDir = path.join(__dirname, '../../uploads/properties');
        if (fs.existsSync(oldUploadsDir)) {
          const oldFiles = fs.readdirSync(oldUploadsDir);
          oldFiles.forEach(file => {
            const filePath = path.join(oldUploadsDir, file);
            try {
              fs.unlinkSync(filePath);
              console.log(`Cleaned up old file: ${file}`);
            } catch (err) {
              console.error(`Failed to delete old file ${file}:`, err);
            }
          });
        }

        // TODO: Save the image URL to database
        // You may want to update the partner's property record with the new image URL
        // await partnerService.updatePropertyImage(email, photoType, cloudinaryResult.url);

        return res.status(200).json({
          success: true,
          message: "Image uploaded successfully to cloud storage",
          data: {
            url: cloudinaryResult.url,
            publicId: cloudinaryResult.publicId,
            fileName: fileName,
            photoType: photoType,
            size: req.file.size,
            mimeType: req.file.mimetype
          }
        });
      } catch (uploadError) {
        // Clean up temp file if upload fails
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
        throw uploadError;
      }

    } catch (error) {
      console.error("Upload Property Image Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to upload image"
      });
    }
  },

  /**
   * UPDATE PHOTOS
   */
  async updatePhotos(req, res) {
    try {
      const { email } = req.query;
      const { photos, photoPublicIds } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required"
        });
      }

      if (!photos) {
        return res.status(400).json({
          success: false,
          message: "Photos data is required"
        });
      }

      // Get partner accommodations
      const partnerAccommodations = await partnerService.getPartnerAccommodations(email);
      
      if (!partnerAccommodations.data || partnerAccommodations.data.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Partner not found"
        });
      }

      // Update photos and photoPublicIds in database
      await partnerService.updatePropertyPhotos(email, photos, photoPublicIds);

      return res.status(200).json({
        success: true,
        message: "Photos saved successfully",
        data: { photos }
      });

    } catch (error) {
      console.error("Update Photos Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to save photos"
      });
    }
  },

  /**
   * UPDATE RULES
   */
  async updateRules(req, res) {
    try {
      const { email } = req.query;
      const { rules } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required"
        });
      }

      if (!rules) {
        return res.status(400).json({
          success: false,
          message: "Rules data is required"
        });
      }

      // Get partner accommodations
      const partnerAccommodations = await partnerService.getPartnerAccommodations(email);
      
      if (!partnerAccommodations.data || partnerAccommodations.data.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Partner not found"
        });
      }

      // Update rules in database
      await partnerService.updatePropertyRules(email, rules);

      return res.status(200).json({
        success: true,
        message: "Rules saved successfully",
        data: { rules }
      });

    } catch (error) {
      console.error("Update Rules Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to save rules"
      });
    }
  },
};
