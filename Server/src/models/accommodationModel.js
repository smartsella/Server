import { query } from '../database/index.js'
import { generateUserId } from '../utils/idGenerator.js';

export const accommodationModel = {
  /**
   * Create a new accommodation service entry
   */
  async createAccommodation(data) {
    let {
      accommodationType,
      ownerName,
      phoneNumber,
      emailId,
      password,
      propertyName,
      location,
      roomsAvailable,
      genderType,
      roomPricing,
      amenities,
      createdBy
    } = data

    // Ensure email is lowercase
    if (emailId) {
      emailId = emailId.toLowerCase();
    }

    // Generate ID
    const id = generateUserId(ownerName);

    const sql = `
      INSERT INTO accommodation_services (
        id,
        accommodation_type,
        owner_name,
        phone_number,
        email_id,
        password,
        property_name,
        location,
        rooms_available,
        gender_type,
        room_pricing,
        amenities,
        created_by,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
      RETURNING *
    `

    const values = [
      id,
      accommodationType,
      ownerName,
      phoneNumber,
      emailId,
      password,
      propertyName,
      location,
      roomsAvailable,
      genderType,
      JSON.stringify(roomPricing),
      JSON.stringify(amenities),
      createdBy
    ]

    const result = await query(sql, values)
    return result.rows[0]
  },

  /**
   * Get accommodation by ID
   */
  async getAccommodationById(id) {
    const sql = 'SELECT * FROM accommodation_services WHERE id = $1'
    const result = await query(sql, [id])
    return result.rows[0]
  },

  /**
   * Get all accommodations by owner email
   */
  async getAccommodationsByEmail(emailId) {
    // Ensure email is lowercase
    const sql = 'SELECT * FROM accommodation_services WHERE email_id = $1 ORDER BY created_at DESC'
    const result = await query(sql, [emailId?.toLowerCase()])
    
    // Parse JSONB fields if they are strings
    const rows = result.rows.map(row => ({
      ...row,
      rules: typeof row.rules === 'string' ? JSON.parse(row.rules) : row.rules,
      property_images: typeof row.property_images === 'string' ? JSON.parse(row.property_images) : row.property_images,
      amenities: typeof row.amenities === 'string' ? JSON.parse(row.amenities) : row.amenities,
      room_pricing: typeof row.room_pricing === 'string' ? JSON.parse(row.room_pricing) : row.room_pricing
    }))
    
    return rows
  },

  /**
   * Get all accommodations
   */
  async getAllAccommodations() {
    const sql = 'SELECT * FROM accommodation_services ORDER BY created_at DESC'
    const result = await query(sql)
    
    // Parse JSONB fields if they are strings
    const rows = result.rows.map(row => ({
      ...row,
      rules: typeof row.rules === 'string' ? JSON.parse(row.rules) : row.rules,
      property_images: typeof row.property_images === 'string' ? JSON.parse(row.property_images) : row.property_images,
      amenities: typeof row.amenities === 'string' ? JSON.parse(row.amenities) : row.amenities,
      room_pricing: typeof row.room_pricing === 'string' ? JSON.parse(row.room_pricing) : row.room_pricing
    }))
    
    return rows
  },

  /**
   * Update accommodation details
   */
  async updateAccommodation(emailId, updates) {
    const {
      ownerName,
      phoneNumber,
      propertyName,
      location,
      roomsAvailable,
      genderType,
      room_pricing,
      amenities,
      rules,
      notice_period,
      property_images
    } = updates

    // Build dynamic SQL query based on provided fields
    const fields = []
    const values = []
    let paramCount = 1

    if (ownerName !== undefined) {
      fields.push(`owner_name = $${paramCount++}`)
      values.push(ownerName)
    }
    if (phoneNumber !== undefined) {
      fields.push(`phone_number = $${paramCount++}`)
      values.push(phoneNumber)
    }
    if (propertyName !== undefined) {
      fields.push(`property_name = $${paramCount++}`)
      values.push(propertyName)
    }
    if (location !== undefined) {
      fields.push(`location = $${paramCount++}`)
      values.push(location)
    }
    if (roomsAvailable !== undefined) {
      fields.push(`rooms_available = $${paramCount++}`)
      values.push(parseInt(roomsAvailable))
    }

    // Additional fields
    if (genderType !== undefined) {
      fields.push(`gender_type = $${paramCount++}`)
      values.push(genderType)
    }

    if (notice_period !== undefined) {
      fields.push(`notice_period = $${paramCount++}`)
      values.push(Number(notice_period))
    }

    if (room_pricing !== undefined) {
      fields.push(`room_pricing = $${paramCount++}`)
      values.push(JSON.stringify(room_pricing))
    }

    if (amenities !== undefined) {
      fields.push(`amenities = $${paramCount++}`)
      values.push(JSON.stringify(amenities))
    }

    if (rules !== undefined) {
      fields.push(`rules = $${paramCount++}`)
      values.push(JSON.stringify(rules))
    }

    if (property_images !== undefined) {
      fields.push(`property_images = $${paramCount++}`)
      values.push(JSON.stringify(property_images))
    }

    if (fields.length === 0) {
      throw new Error('No fields to update')
    }
    
    // Add email condition
    values.push(emailId?.toLowerCase())

    const sql = `
      UPDATE accommodation_services 
      SET ${fields.join(', ')}
      WHERE LOWER(email_id) = $${paramCount}
      RETURNING *
    `

    const result = await query(sql, values)
    return result.rows[0]
  }
}
