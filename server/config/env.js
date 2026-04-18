const dotenv = require('dotenv');

dotenv.config();

const requiredVariables = ['SUPABASE_URL', 'JWT_SECRET'];

const missingVariables = requiredVariables.filter((name) => !process.env[name]);

if (missingVariables.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVariables.join(', ')}`);
}

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseKey) {
  throw new Error('Missing required Supabase key. Set SUPABASE_SERVICE_ROLE_KEY (recommended) or SUPABASE_ANON_KEY.');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY is not set. Falling back to SUPABASE_ANON_KEY may fail for write operations.');
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 8000,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@nujoombiriyani.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!',
  adminSetupToken: process.env.ADMIN_SETUP_TOKEN || '',
  seedToken: process.env.SEED_TOKEN || '',
};
