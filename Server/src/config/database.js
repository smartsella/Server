import pg from 'pg';
import dotenv from 'dotenv';
import dns from 'dns';

// Set DNS to prefer IPv4
dns.setDefaultResultOrder('ipv4first');

dotenv.config();

const { Pool } = pg;

// Parse the DATABASE_URL to extract connection details
const connectionString = process.env.DATABASE_URL;

// Create a connection pool with explicit IPv4 configuration
const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000,
  // Use Node's dns module to prefer IPv4
  options: '-c client_encoding=UTF8'
});

// Test the connection
pool.on('connect', () => {
  console.log('✅ Connected to Neon PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
