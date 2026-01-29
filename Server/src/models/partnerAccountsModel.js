import db from '../database/index.js';

export const partnerAccountsModel = {
  async createPartnerAccount({
    id, // id from services or accommodation_services
    email,
    phone_number,
    password_hash,
    auth_provider = 'local',
    partner_type,
    dashboard_route,
    reference_table,
    reference_row_id
  }) {
    const created_at = new Date();
    const emailLower = email?.toLowerCase();
    const query = `
      INSERT INTO partner_accounts (
        id, email, phone_number, password_hash, auth_provider, partner_type, dashboard_route, reference_table, reference_row_id, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      ON CONFLICT (email) DO UPDATE SET
        id = EXCLUDED.id,
        phone_number = EXCLUDED.phone_number,
        password_hash = EXCLUDED.password_hash,
        auth_provider = EXCLUDED.auth_provider,
        partner_type = EXCLUDED.partner_type,
        dashboard_route = EXCLUDED.dashboard_route,
        reference_table = EXCLUDED.reference_table,
        reference_row_id = EXCLUDED.reference_row_id
      RETURNING *;
    `;
    const values = [
      id,
      emailLower,
      phone_number,
      password_hash,
      auth_provider,
      partner_type,
      dashboard_route,
      reference_table,
      reference_row_id,
      created_at
    ];
    const { rows } = await db.query(query, values);
    return rows[0];
  }
};
