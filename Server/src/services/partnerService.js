import { accommodationModel } from "../models/accommodationModel.js";
import bcrypt from 'bcrypt';

import { createService } from "../models/servicesModel.js";
import {
  transformAmenities,
  AMENITIES_OPTIONS,
} from "../utils/transformAmenities.js";
import { partnerAccountsModel } from "../models/partnerAccountsModel.js";

export const partnerService = {
  /**
   * Register a new partner accommodation service
   */
  async registerAccommodation(partnerData) {
    let {
      partnerType,
      serviceCategory,
      ownerName,
      phone,
      email,
      password,
      propertyName,
      location,
      roomsAvailable,
      gender,
      roomTypes,
      amenities,
    } = partnerData;

    // Ensure email is lowercase
    if (email) {
      email = email.toLowerCase();
    }

    // Validate required fields
    if (
      !ownerName ||
      !phone ||
      !email ||
      !password ||
      !propertyName ||
      !location
    ) {
      throw new Error("Missing required fields");
    }

    // Transform amenities from array format to true/false object
    const transformedAmenities = transformAmenities(
      amenities,
      AMENITIES_OPTIONS
    );

    // Transform room types into pricing structure
    const roomPricing = {};
    if (roomTypes && roomTypes.length > 0) {
      roomTypes.forEach((room) => {
        if (room.type && (room.rent || room.deposit)) {
          roomPricing[room.type] = {
            rent: parseFloat(room.rent) || 0,
            deposit: parseFloat(room.deposit) || 0,
          };
        }
      });
    }

    // Prepare data for database insertion
    const accommodationData = {
      accommodationType: partnerType,
      ownerName: ownerName,
      phoneNumber: phone,
      emailId: email,
      password: password,
      propertyName: propertyName,
      location: location,
      roomsAvailable: parseInt(roomsAvailable) || 0,
      genderType: gender || "Co-living",
      roomPricing: roomPricing,
      amenities: transformedAmenities,
      createdBy: ownerName,
    };

    try {
      // Insert into database
      const result = await accommodationModel.createAccommodation(accommodationData)

      // Insert into partner_accounts
      await partnerAccountsModel.createPartnerAccount({
        id: result.id, // use the same string id used in accommodation_services
        email,
        phone_number: phone,
        password_hash: password, // If you hash, use the hash here
        auth_provider: 'local',
        partner_type: partnerType,
        dashboard_route: `/partner/accommodation/${partnerType}/dashboard`,
        reference_table: 'accommodation_services',
        reference_row_id: result.id, // string id from accommodation_services
      });

      return {
        success: true,
        message: 'Accommodation registered successfully',
        data: result
      }
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('This email or phone number is already registered. Please login instead.')
      }
      throw error
    }
  },

  /**
   * Register a new partner service (non-accommodation)
   */
  async registerService(partnerData) {
    let {
      partnerType,
      serviceCategory,
      ownerName,
      phone,
      email,
      password,
      propertyName,
      businessName,
      location,
    } = partnerData;

    // Ensure email is lowercase
    if (email) {
      email = email.toLowerCase();
    }

    // Validate required fields
    if (
      !ownerName ||
      !phone ||
      !email ||
      !password ||
      (!propertyName && !businessName) ||
      !location
    ) {
      throw new Error("Missing required fields");
    }

    // Normalize business name: createService expects 'propertyName' or we map it
    // effectively createService pulls: ownerName, phone, email, password, propertyName, location...

    // Prepare data for database insertion
    // We pass the whole object, but ensure propertyName is set if businessName was passed
    if (!partnerData.propertyName && partnerData.businessName) {
      partnerData.propertyName = partnerData.businessName;
    }

    try {
      // Insert into services table
      const result = await createService(partnerData);

      // Determine dashboard route
      let dashboardRoute = "/partner/dashboard"; // Default
      if (partnerType) {
        const ptSlug = partnerType.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        // Heuristic for daily living services logic
        if (serviceCategory && serviceCategory.toLowerCase().includes('daily')) {
          dashboardRoute = `/partner/dailyLiving/${ptSlug}/dashboard`;
        } else {
          // Fallback or other categories
          dashboardRoute = `/partner/${ptSlug}/dashboard`;
        }
      }

      // Insert into partner_accounts
      await partnerAccountsModel.createPartnerAccount({
        id: result.id,
        email,
        phone_number: phone,
        password_hash: password,
        auth_provider: 'local',
        partner_type: partnerType,
        dashboard_route: dashboardRoute,
        reference_table: 'services',
        reference_row_id: result.id,
      });

      return {
        success: true,
        message: 'Service registered successfully',
        data: result
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('This email or phone number is already registered. Please login instead.')
      }
      throw error;
    }
  },

  /**
   * Get partner accommodations by email
   */
  async getPartnerAccommodations(email) {
    const { query } = await import("../database/index.js");

    // Ensure email is lowercase
    const normalizedEmail = email?.toLowerCase();

    // Fetch accommodations from accommodation_services table
    const accommodations = await accommodationModel.getAccommodationsByEmail(
      normalizedEmail
    );

    // Also fetch services from services table
    let services = [];
    try {
      const servicesSql = "SELECT * FROM services WHERE LOWER(email_id) = $1";
      const servicesResult = await query(servicesSql, [normalizedEmail]);
      services = servicesResult.rows || [];
    } catch (err) {
      console.error("Error fetching services:", err);
    }

    // Return both separately for better handling
    return {
      success: true,
      count: accommodations.length + services.length,
      accommodations: accommodations,
      services: services,
      data: [...accommodations, ...services],
    };
  },

  /**
   * Get all accommodations (public)
   */
  async getAllAccommodations() {
    const accommodations = await accommodationModel.getAllAccommodations();
    return {
      success: true,
      count: accommodations.length,
      data: accommodations,
    };
  },
  /**
   * Update partner accommodation details
   */
  async updatePartnerAccommodation(email, updates) {
    // Ensure email is lowercase
    const normalizedEmail = email?.toLowerCase();

    if (!normalizedEmail) {
      throw new Error('Email is required to update accommodation');
    }

    try {
      // Normalize incoming fields: convert roomTypes array to room_pricing object if provided
      const payload = { ...updates }

      if (payload.roomTypes && Array.isArray(payload.roomTypes)) {
        const roomPricing = {}
        payload.roomTypes.forEach(rt => {
          if (rt.type && (rt.rent !== undefined || rt.deposit !== undefined)) {
            roomPricing[rt.type] = {
              rent: parseFloat(rt.rent) || 0,
              deposit: parseFloat(rt.deposit) || 0
            }
          }
        })
        payload.room_pricing = roomPricing
        // keep roomTypes if needed by response or client, but primary storage is room_pricing
        delete payload.roomTypes
      }

      // Map noticePeriod -> notice_period and gender -> gender_type for DB columns if present
      if (payload.noticePeriod !== undefined) {
        payload.notice_period = payload.noticePeriod
        delete payload.noticePeriod
      }
      if (payload.gender !== undefined) {
        payload.gender_type = payload.gender
        delete payload.gender
      }

      // If photos or photoPublicIds passed as photos/photoPublicIds, they should be saved via updatePropertyPhotos API

      const updatedAccommodation = await accommodationModel.updateAccommodation(
        normalizedEmail,
        payload
      );

      if (!updatedAccommodation) {
        throw new Error('Accommodation not found or update failed');
      }

      return {
        success: true,
        message: 'Accommodation updated successfully',
        data: updatedAccommodation,
      };
    } catch (error) {
      console.error('Error updating accommodation:', error);
      throw new Error(error.message || 'Failed to update accommodation');
    }
  },

  /**
   * Update partner service details
   */
  async updatePartnerService(email, updates) {
    // Ensure email is lowercase
    const normalizedEmail = email?.toLowerCase();

    if (!normalizedEmail) {
      throw new Error('Email is required to update service');
    }

    try {
      const { updateService } = await import('../models/servicesModel.js');
      const updatedService = await updateService(normalizedEmail, updates);

      if (!updatedService) {
        throw new Error('Service not found or update failed');
      }

      return {
        success: true,
        message: 'Service updated successfully',
        data: updatedService,
      };
    } catch (error) {
      console.error('Error updating service:', error);
      throw new Error(error.message || 'Failed to update service');
    }
  },
  /**
   * Get partner stores by email (from services table)
   */
  async getPartnerStores(email) {
    const { query } = await import("../database/index.js");

    // Ensure email is lowercase
    const normalizedEmail = email?.toLowerCase();

    console.log('🔍 getPartnerStores - Searching for email:', normalizedEmail);

    // First, try to fetch ALL services for this email to debug
    try {
      const allServicesSql = `SELECT * FROM services WHERE LOWER(email_id) = $1`;
      const allServicesResult = await query(allServicesSql, [normalizedEmail]);
      console.log('📊 All services for this email:', allServicesResult.rows);

      // Fetch services from services table where service_category starts with 'Daily Living'
      const servicesSql = `
        SELECT * FROM services 
        WHERE LOWER(email_id) = $1 
        AND LOWER(service_category) LIKE 'daily living%'
      `;
      const servicesResult = await query(servicesSql, [normalizedEmail]);
      const stores = servicesResult.rows || [];

      console.log('✅ Filtered stores found:', stores.length);

      // If no stores found with filter, return the first service regardless of category
      if (stores.length === 0 && allServicesResult.rows.length > 0) {
        console.log('⚠️  No Daily Living services found, returning first available service');
        return {
          success: true,
          count: 1,
          data: allServicesResult.rows[0],
        };
      }

      return {
        success: true,
        count: stores.length,
        data: stores.length > 0 ? stores[0] : null,
      };
    } catch (err) {
      console.error("❌ Error fetching stores:", err);
      throw new Error("Failed to fetch store data");
    }
  },

  /**
   * Partner login with email/phone and password
   */
  async loginPartner(identifier, password) {
    const { query } = await import("../database/index.js");

    // Check if identifier is email or phone
    let idValue = identifier;
    const isEmail = identifier.includes("@");
    if (isEmail) {
      idValue = identifier.toLowerCase();
    }
    const sql = isEmail
      ? "SELECT * FROM accommodation_services WHERE email_id = $1"
      : "SELECT * FROM accommodation_services WHERE phone_number = $1";

    const result = await query(sql, [idValue]);

    if (result.rows.length === 0) {
      // Try partner_accounts table (covers non-accommodation partners or central auth)
      try {
        const paQuery = isEmail
          ? 'SELECT * FROM partner_accounts WHERE LOWER(email) = $1 LIMIT 1'
          : 'SELECT * FROM partner_accounts WHERE phone_number = $1 LIMIT 1'
        const paRes = await query(paQuery, [idValue.toLowerCase()])
        if (paRes.rows.length === 0) throw new Error('Invalid credentials')

        const partnerAccount = paRes.rows[0];

        // Verify password against partner_accounts.password_hash (may be plain)
        let isMatch = partnerAccount.password_hash === password;
        if (!isMatch && partnerAccount.password_hash && partnerAccount.password_hash.startsWith('$2')) {
          try {
            isMatch = await bcrypt.compare(password, partnerAccount.password_hash);
          } catch (e) { console.error("Bcrypt compare error:", e); }
        }

        if (!isMatch) {
          throw new Error("Invalid credentials");
        }

        // Build user payload from partner_accounts
        let accommodations = [];
        let services = [];
        let accommodationRow = null;

        // Fetch data based on reference table
        if (
          partnerAccount.reference_table === "accommodation_services" &&
          partnerAccount.reference_row_id
        ) {
          accommodationRow = await accommodationModel.getAccommodationById(
            partnerAccount.reference_row_id
          );
          if (accommodationRow && accommodationRow.email_id) {
            accommodations = await accommodationModel.getAccommodationsByEmail(
              accommodationRow.email_id
            );
          }
        } else if (
          partnerAccount.reference_table === "services" &&
          partnerAccount.reference_row_id
        ) {
          // Fetch service data
          try {
            const serviceSql = "SELECT * FROM services WHERE id = $1";
            const serviceResult = await query(serviceSql, [partnerAccount.reference_row_id]);
            if (serviceResult.rows.length > 0) {
              services.push(serviceResult.rows[0]);
            }
          } catch (err) {
            console.error("Error fetching service data:", err);
          }
        }

        // Ensure dashboard_route matches available client routes. If missing or generic, try to compute from reference
        let dashboardRoute = partnerAccount.dashboard_route;
        try {
          if (!dashboardRoute || dashboardRoute.includes("daily-living")) {
            if (
              partnerAccount.reference_table === "services" &&
              partnerAccount.reference_row_id
            ) {
              // Use partner_type instead of service_category for the route
              // Remove special characters and convert to URL-friendly format
              if (partnerAccount.partner_type) {
                const pt = partnerAccount.partner_type
                  .toLowerCase()
                  .replace(/[^a-z0-9\s]/g, '') // Remove special chars except spaces
                  .replace(/\s+/g, "-"); // Replace spaces with hyphens
                dashboardRoute = `/partner/dailyLiving/${pt}/dashboard`;
              }
            } else if (partnerAccount.partner_type) {
              const st = partnerAccount.partner_type
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, '') // Remove special chars except spaces
                .replace(/\s+/g, "-"); // Replace spaces with hyphens
              dashboardRoute = `/partner/accommodation/${st}/dashboard`;
            }
          }
        } catch (err) {
          console.error("Error computing fallback dashboard route:", err);
        }

        console.log(
          "✅ Partner login matched partner_accounts for",
          partnerAccount.email || partnerAccount.phone_number
        );

        return {
          success: true,
          message: "Login successful",
          data: {
            user: {
              id: partnerAccount.id,
              full_name: accommodationRow?.owner_name || (services[0]?.owner_name) || partnerAccount.email,
              email: partnerAccount.email,
              phone: partnerAccount.phone_number,
              user_type: "partner",
              partner_type: partnerAccount.partner_type,
              dashboard_route: dashboardRoute,
            },
            accommodations: accommodations,
            services: services,
          },
        };
      } catch (err) {
        // Try direct login from services table if not found in partner_accounts
        if (isEmail) {
          const serviceSql = "SELECT * FROM services WHERE LOWER(email_id) = $1";
          const serviceResult = await query(serviceSql, [idValue.toLowerCase()]);
          if (serviceResult.rows.length > 0) {
            const service = serviceResult.rows[0];
            let isMatch = service.password === password;
            if (!isMatch && service.password && service.password.startsWith('$2')) {
              try {
                isMatch = await bcrypt.compare(password, service.password);
              } catch (e) { console.error("Bcrypt compare error:", e); }
            }
            if (isMatch) {
              // Build user payload for service partner
              return {
                success: true,
                message: "Login successful",
                data: {
                  user: {
                    id: service.id,
                    full_name: service.owner_name,
                    email: service.email_id,
                    phone: service.phone_number,
                    user_type: "partner",
                    partner_type: service.service_category,
                    dashboard_route: `/partner/dailyLiving/${(service.service_category || '').toLowerCase().replace(/\s+/g, '-')}/dashboard`,
                  },
                  accommodations: [],
                  services: [service],
                },
              };
            }
          }
        }
        throw new Error("Invalid credentials");
      }
    }

    const accommodation = result.rows[0];

    // Verify password (plain text comparison or bcrypt)
    let isMatch = accommodation.password === password;
    if (!isMatch && accommodation.password && accommodation.password.startsWith('$2')) {
      try {
        isMatch = await bcrypt.compare(password, accommodation.password);
      } catch (e) { console.error("Bcrypt compare error:", e); }
    }

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    // Get all accommodations for this partner
    const accommodations = await accommodationModel.getAccommodationsByEmail(
      accommodation.email_id?.toLowerCase()
    );

    // Also fetch services in case this partner has both
    let services = [];
    try {
      const servicesSql = "SELECT * FROM services WHERE LOWER(email_id) = $1";
      const servicesResult = await query(servicesSql, [accommodation.email_id?.toLowerCase()]);
      services = servicesResult.rows || [];
    } catch (err) {
      console.error("Error fetching services:", err);
    }

    // Try to fetch partner_accounts entry to get dashboard route and partner type
    let dashboardRoute = null;
    let partnerType = null;
    try {
      const paByRef = await query(
        "SELECT dashboard_route, partner_type FROM partner_accounts WHERE reference_row_id = $1 AND reference_table = $2 LIMIT 1",
        [accommodation.id, "accommodation_services"]
      );
      if (paByRef.rows.length > 0) {
        dashboardRoute = paByRef.rows[0].dashboard_route;
        partnerType = paByRef.rows[0].partner_type;
      } else {
        const paByEmail = await query(
          "SELECT dashboard_route, partner_type FROM partner_accounts WHERE email = $1 LIMIT 1",
          [accommodation.email_id?.toLowerCase()]
        );
        if (paByEmail.rows.length > 0) {
          dashboardRoute = paByEmail.rows[0].dashboard_route;
          partnerType = paByEmail.rows[0].partner_type;
        }
      }
    } catch (err) {
      console.error(
        "Error fetching partner_accounts for dashboard route:",
        err
      );
    }

    return {
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: accommodation.id,
          full_name: accommodation.owner_name,
          email: accommodation.email_id,
          phone: accommodation.phone_number,
          user_type: "partner",
          partner_type: partnerType,
          dashboard_route: dashboardRoute,
        },
        accommodations: accommodations,
        services: services,
      },
    };
  },

  /**
   * Update property photos
   */
  async updatePropertyPhotos(email, photos, photoPublicIds) {
    const { query } = await import("../database/index.js");
    const normalizedEmail = email?.toLowerCase();

    try {
      // Convert photos object to images array format
      const imagesArray = [];
      if (photos) {
        Object.values(photos).forEach(url => {
          if (url && !url.startsWith('blob:')) { // Only include actual Cloudinary URLs
            imagesArray.push(url);
          }
        });
      }

      // Format according to expected structure: {"images": [...]}
      const propertyImages = {
        images: imagesArray,
        photoPublicIds: photoPublicIds || {}
      };

      // Update accommodation_services table with property_images
      const sql = `
        UPDATE accommodation_services 
        SET property_images = $1
        WHERE LOWER(email_id) = $2
        RETURNING *
      `;

      const result = await query(sql, [
        JSON.stringify(propertyImages),
        normalizedEmail
      ]);

      if (result.rows.length === 0) {
        throw new Error("Property not found");
      }

      return result.rows[0];
    } catch (error) {
      console.error("Error updating photos:", error);
      throw error;
    }
  },

  /**
   * Update property rules
   */
  async updatePropertyRules(email, rules) {
    const { query } = await import("../database/index.js");
    const normalizedEmail = email?.toLowerCase();

    try {
      // Update accommodation_services table
      const sql = `
        UPDATE accommodation_services 
        SET rules = $1
        WHERE LOWER(email_id) = $2
        RETURNING *
      `;

      const result = await query(sql, [JSON.stringify(rules), normalizedEmail]);

      if (result.rows.length === 0) {
        throw new Error("Property not found");
      }

      return result.rows[0];
    } catch (error) {
      console.error("Error updating rules:", error);
      throw error;
    }
  },
}
