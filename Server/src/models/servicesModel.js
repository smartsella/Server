// servicesModel.js - Model for non-accommodation partner services
/*
 * SERVICE DATA STRUCTURE BY TYPE:
 * 
 * All service-specific data is stored in two JSONB columns:
 * - service_metadata: Contains type-specific metadata (NO PHOTOS)
 * - service_catalog: Contains offers/specials and service-specific items
 * 
 * FOOD & TIFFIN SERVICE:
 *   service_metadata: {
 *     cuisineType: string
 *   }
 *   service_catalog: {
 *     dailySpecials: [string],
 *     cuisines: [{ name, vegMenu, nonVegMenu }]
 *   }
 * 
 * LAUNDRY SERVICE:
 *   service_metadata: {
 *     serviceType: string
 *   }
 *   service_catalog: {
 *     offers: [string],
 *     services: [{ name, rateCard }]
 *   }
 * 
 * LOCAL STORE:
 *   service_metadata: {
 *     storeType: string
 *   }
 *   service_catalog: {
 *     offers: [string],
 *     inventory: [{ name, price, category: [Grocery, Medical, Personal Care, Snacks], stock: [In Stock, Out of Stock, Low Stock] }]
 *   }
 * 
 * REPAIR SERVICES:
 *   service_metadata: {
 *     tradeType: string
 *   }
 *   service_catalog: {
 *     offers: [string],
 *     services: [{ name, price, category: [General, Electrical, Plumbing, Carpentry, Appliances], type: [Service, Installation, Repair, Maintenance] }]
 *   }
 * 
 * WATER DELIVERY:
 *   service_metadata: {
 *     deliveryCharge: number
 *   }
 *   service_catalog: {
 *     offers: [string],
 *     products: [{ name, price, capacity }]
 *   }
 */

import db from '../config/database.js';
import { query } from '../database/index.js';
import { generateUserId } from '../utils/idGenerator.js';

export const createService = async (serviceData) => {
  const {
    ownerName,
    phone,
    email,
    password,
    propertyName,
    location,
    serviceCategory,
    partnerType,
    servicePricing, // Should be an array of pricing objects
    serviceMetadata = {}, // Additional service metadata
    serviceCatalog = {}, // Service catalog information
  } = serviceData;

  // Fallbacks and mapping
  const owner_name = ownerName;
  const phone_number = phone;
  const email_id = email;
  const business_name = propertyName;
  const created_by = ownerName;
  // If servicePricing is not provided, create a default
  let pricing = servicePricing;
  if (!pricing) {
    pricing = [{ price: null, service_type: 'Basic Plan' }];
  }

  // Format service_category: Map specific service types to simplified category names
  // as requested: Food, Laundry, Water, Repair, Store
  let formattedServiceCategory = serviceCategory;

  if (partnerType) {
    const pTypeLower = partnerType.toLowerCase();
    if (pTypeLower.includes('food')) {
      formattedServiceCategory = 'Food';
    } else if (pTypeLower.includes('laundry')) {
      formattedServiceCategory = 'Laundry';
    } else if (pTypeLower.includes('water')) {
      formattedServiceCategory = 'Water';
    } else if (pTypeLower.includes('repair')) {
      formattedServiceCategory = 'Repair';
    } else if (pTypeLower.includes('store') || pTypeLower.includes('directory')) {
      formattedServiceCategory = 'Store';
    } else if (serviceCategory && serviceCategory !== 'Accommodation') {
      // Default fallback: combine category with service type
      formattedServiceCategory = `${serviceCategory} - ${partnerType}`;
    }
  } else if (serviceCategory && serviceCategory !== 'Accommodation' && partnerType) {
    formattedServiceCategory = `${serviceCategory} - ${partnerType}`;
  }

  // Generate ID
  const id = generateUserId(ownerName);

  const sql = `
    INSERT INTO services (
      id,
      owner_name, phone_number, email_id, business_name, location, 
      service_category, service_pricing, service_metadata, service_catalog, 
      created_by, password
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10::jsonb, $11, $12)
    RETURNING *
  `;
  const values = [
    id,
    owner_name,
    phone_number,
    email_id,
    business_name,
    location,
    formattedServiceCategory,
    JSON.stringify({ pricing }),
    JSON.stringify(serviceMetadata),
    JSON.stringify(serviceCatalog),
    created_by,
    password
  ];
  const { rows } = await db.query(sql, values);
  return rows[0];
};

export const updateService = async (emailId, updates) => {
  const {
    ownerName,
    phoneNumber,
    businessName,
    location,
    serviceCategory,
    servicePricing,
    serviceMetadata,
    serviceCatalog,
    offers,
    password
  } = updates;

  // Build dynamic SQL query based on provided fields
  const fields = [];
  const values = [];
  let paramCount = 1;

  if (ownerName !== undefined) {
    fields.push(`owner_name = $${paramCount++}`);
    values.push(ownerName);
  }
  if (phoneNumber !== undefined) {
    fields.push(`phone_number = $${paramCount++}`);
    values.push(phoneNumber);
  }
  if (businessName !== undefined) {
    fields.push(`business_name = $${paramCount++}`);
    values.push(businessName);
  }
  if (location !== undefined) {
    fields.push(`location = $${paramCount++}`);
    values.push(location);
  }
  if (serviceCategory !== undefined) {
    fields.push(`service_category = $${paramCount++}`);
    values.push(serviceCategory);
  }
  if (servicePricing !== undefined) {
    fields.push(`service_pricing = $${paramCount++}::jsonb`);
    values.push(JSON.stringify({ pricing: servicePricing }));
  }
  if (serviceCatalog !== undefined) {
    fields.push(`service_catalog = $${paramCount++}::jsonb`);
    values.push(JSON.stringify(serviceCatalog));
  }
  if (offers !== undefined) {
    fields.push(`offers = $${paramCount++}::jsonb`);
    values.push(JSON.stringify(offers));
  }
  if (password !== undefined) {
    fields.push(`password = $${paramCount++}`);
    values.push(password);
  }

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  // Add email condition
  values.push(emailId?.toLowerCase());

  const sql = `
    UPDATE services 
    SET ${fields.join(', ')}
    WHERE LOWER(email_id) = $${paramCount}
    RETURNING *
  `;

  console.log('🔄 Update Service SQL:', sql);
  console.log('🔄 Update Service Values:', JSON.stringify(values, null, 2));

  const result = await query(sql, values);

  console.log('✅ Update Service Result:', result.rows[0] ? 'Success' : 'No rows updated');

  return result.rows[0];
};
